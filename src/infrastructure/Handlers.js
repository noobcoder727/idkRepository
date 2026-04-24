// IR07 – Handlery (UI → akce) - Duy Anh Le
import { dispatch } from "./Dispatcher.js";
import { authService } from "./Auth.js";
import { api } from "./MockApi.js";
import { validateReservation } from "./Reservation.js";
import { getUnitById } from "./Selectors.js";
import { getState } from "./State.js";
import { dispatch } from "./Dispatcher.js";


/* AUTH HANDLERS */

// přihlášení (využívá Auth service → ten už dispatchuje)
export const handleLogin = (username, role) => {
    authService.login(username, role);
};

// odhlášení
export const handleLogout = () => {
    authService.logout();
};

/* UNIT HANDLERS (ubytování) */

// publikování ubytování
export const handlePublishUnit = (unitId) => {
    dispatch({
        type: "PUBLISH_UNIT",
        payload: { unitID: unitId }
    });
};
// přepnutí do maintenance (připrav si i dispatcher case)
export const handleStartMaintenance = (unitId) => {
    dispatch({
        type: "START_MAINTENANCE",
        payload: { unitID: unitId }
    });
};


/* RESERVATION HANDLERS */

// vytvoření rezervace
export const handleCreateReservation = async (data) => {
    dispatch({ type: "API_CALL_START" });

    try {
        const reservation = await api.createReservation({
            ...data,
            id: Date.now(),
            status: "CREATED"
        });

        dispatch({
            type: "CREATE_RESERVATION",
            payload: reservation
        });

        dispatch({ type: "API_CALL_SUCCESS" });

    } catch (error) {
        dispatch({
            type: "API_CALL_ERROR",
            payload: { error: error.message }
        });
    }
};

// schválení rezervace (admin)
export const handleApproveReservation = async (id) => {
    const state = getState();
    const unit = getUnitById(state, data.unitId);

    try {
        validateReservation(data, unit);

        dispatch({
            type: "CREATE_RESERVATION",
            payload: {
                ...data,
                status: "PENDING"
            }
        });

    } catch (err) {
        dispatch({
            type: "API_CALL_ERROR",
            payload: { error: err.message }
        });
    }
};

// zrušení rezervace
export const handleCancelReservation = async (id) => {
    dispatch({ type: "API_CALL_START" });

    try {
        await api.updateReservation(id, { status: "CANCELLED" });

        dispatch({
            type: "CANCEL_RESERVATION",
            payload: { reservationId: id }
        });

        dispatch({ type: "API_CALL_SUCCESS" });

    } catch (error) {
        dispatch({
            type: "API_CALL_ERROR",
            payload: { error: error.message }
        });
    }
};

/* NAVIGATION HANDLERS */

// změna stránky (router to zachytí)
export const handleNavigate = (route, id = null) => {
    window.location.hash = id ? `${route}/${id}` : route;
};

/* UI / ASYNC HANDLERS */

// načtení částí (GET)
export const handleLoadUnits = async () => {
    dispatch({ type: "API_CALL_START" });

    try {
        const units = await api.fetchUnits();

        dispatch({
            type: "API_CALL_SUCCESS",
            payload: { units }
        });

    } catch (error) {
        dispatch({
            type: "API_CALL_ERROR",
            payload: { error: error.message }
        });
    }

    
};


