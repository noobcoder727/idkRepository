// IR07 – Handlery (UI → akce) - Duy Anh Le
// IR07 – Handlery (UI → akce) - Duy Anh Le
import { dispatch } from "./Dispatcher.js";
import { authService } from "./Auth.js";
import { api } from "../api/MockApi.js"; 
import { validateReservation } from "../business/Reservations.js"; 
import { getUnitById, isAdmin, getCurrentUser } from "./Selectors.js";
import { getState } from "./State.js";

// AUTH HANDLERS 

// přihlášení (využívá Auth service → ten už dispatchuje)
export const handleLogin = (username, role) => {
    authService.login(username, role);
};

// odhlášení
export const handleLogout = () => {
    authService.logout();
};

// UNIT HANDLERS (ubytování)

// publikování ubytování - only admin
export const handlePublishUnit = (unitId) => {
    const state = getState();
    if (!isAdmin(state)) {
        alert("Pouze admin může publikovat ubytování.");
        return;
    }
    
    dispatch({
        type: "PUBLISH_UNIT",
        payload: { unitID: unitId }
    });
};

// přepnutí do maintenance - only admin
export const handleStartMaintenance = (unitId) => {
    const state = getState();
    if (!isAdmin(state)) {
        alert("Pouze admin může přepnout ubytování do údržby.");
        return;
    }
    
    dispatch({
        type: "START_MAINTENANCE",
        payload: { unitID: unitId }
    });
};

// RESERVATION HANDLERS 

// vytvoření rezervace - both admin and user can create, but admin creates from home, user from reservations
export const handleCreateReservation = async (data) => {
    const state = getState();
    if (!state.auth.user) {
        alert("Pro vytvoření rezervace se prosím přihlaste.");
        return;
    }

    dispatch({ type: "API_CALL_START" });

    try {
        // Validate data before sending to API
        if (!data.unitId || !data.dateFrom || !data.dateTo) {
            throw new Error("Všechna pole jsou povinná");
        }

        const reservation = await api.createReservation(data);

        dispatch({
            type: "CREATE_RESERVATION",
            payload: reservation
        });

        dispatch({ type: "API_CALL_SUCCESS" });

        // Clear the form after successful creation - try both sets of form fields
        const dateFrom = document.getElementById("dateFrom") || document.getElementById("dateFromUser");
        const dateTo = document.getElementById("dateTo") || document.getElementById("dateToUser");
        if (dateFrom) dateFrom.value = new Date().toISOString().split('T')[0];
        if (dateTo) dateTo.value = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

        alert("Rezervace byla úspěšně vytvořena!");

    } catch (error) {
        dispatch({
            type: "API_CALL_ERROR",
            payload: { error: error.message }
        });
        alert(`Chyba: ${error.message}`);
    }
};

// schválení rezervace - only admin
export const handleApproveReservation = async (id) => {
    const state = getState();
    if (!isAdmin(state)) {
        alert("Pouze admin může schvalovat rezervace.");
        return;
    }

    const reservation = state.reservations.find(r => r.id === id);
    const unit = getUnitById(state, reservation.unitId);

    try {
        validateReservation(reservation, unit);

        dispatch({
            type: "APPROVE_RESERVATION",
            payload: { reservationId: id }
        });

        alert("Rezervace byla schválena!");

    } catch (err) {
        dispatch({
            type: "API_CALL_ERROR",
            payload: { error: err.message }
        });
        alert(`Chyba: ${err.message}`);
    }
};

// zrušení rezervace - only admin
export const handleCancelReservation = async (id) => {
    const state = getState();
    if (!isAdmin(state)) {
        alert("Pouze admin může rušit rezervace.");
        return;
    }

    dispatch({ type: "API_CALL_START" });

    try {
        await api.updateReservation(id, { status: "CANCELLED" });

        dispatch({
            type: "CANCEL_RESERVATION",
            payload: { reservationId: id }
        });

        dispatch({ type: "API_CALL_SUCCESS" });
        alert("Rezervace byla zrušena!");

    } catch (error) {
        dispatch({
            type: "API_CALL_ERROR",
            payload: { error: error.message }
        });
        alert(`Chyba: ${error.message}`);
    }
};

// NAVIGATION HANDLERS 

// změna stránky (router to zachytí)
export const handleNavigate = (route, id = null) => {
    window.location.hash = id ? `${route}/${id}` : route;
};

// UI / ASYNC HANDLERS 

// načtení částí (GET)
export const handleLoadUnits = async () => {
    console.log("handleLoadUnits: Starting...");
    dispatch({ type: "API_CALL_START" });

    try {
        console.log("handleLoadUnits: Calling api.fetchUnits()...");
        const units = await api.fetchUnits();
        console.log("handleLoadUnits: Received units:", units);
        
        // Make sure units is an array
        if (!units || !Array.isArray(units)) {
            console.error("handleLoadUnits: Units is not an array!", units);
            throw new Error("Načtená data nejsou ve správném formátu");
        }

        console.log("handleLoadUnits: Dispatching API_CALL_SUCCESS with payload:", { units });
        dispatch({
            type: "API_CALL_SUCCESS",
            payload: { units }
        });
        console.log("handleLoadUnits: API_CALL_SUCCESS dispatched");

    } catch (error) {
        console.error("handleLoadUnits: Error:", error);
        dispatch({
            type: "API_CALL_ERROR",
            payload: { error: error.message || "Nepodařilo se načíst ubytování" }
        });
    }
};