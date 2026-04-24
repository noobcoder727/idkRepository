// business logika - Reservation entity - Duy Anh Le
import { getState } from "./State.js";
import { validateReservation } from "./Reservation.js";
import { getUnitById } from "./selectors.js";
import { getState } from "./State.js";
import { dispatch } from "./Dispatcher.js";

/* VALIDACE DAT */

export const validateReservationDates = (reservation) => {
    const checkIn = new Date(reservation.dateFrom);
    const checkOut = new Date(reservation.dateTo);

    if (checkOut <= checkIn) {
        throw new Error("checkOutDate musí být později než checkInDate!");
    }
};


/* KONTROLA UBYTOVÁNÍ */

export const validateUnitAvailability = (unit) => {
    if (unit.status === "MAINTENANCE") {
        throw new Error("Nelze rezervovat ubytování v údržbě!");
    }
};


/* KONFLIKT REZERVACÍ */

export const validateNoOverlappingReservations = (reservation) => {
    const state = getState();

    const newStart = new Date(reservation.dateFrom);
    const newEnd = new Date(reservation.dateTo);

    const conflicts = state.reservations.filter(r => {
        if (r.unitId !== reservation.unitId) return false;
        if (r.status !== "CONFIRMED") return false;

        const start = new Date(r.dateFrom);
        const end = new Date(r.dateTo);

        // overlap condition
        return newStart < end && newEnd > start;
    });

    if (conflicts.length > 0) {
        throw new Error("Tato rezervace se překrývá s existující potvrzenou rezervací!");
    }
};


/* HLAVNÍ VALIDACE */

export const validateReservation = (reservation, unit) => {
    validateReservationDates(reservation);
    validateUnitAvailability(unit);
    validateNoOverlappingReservations(reservation);

    return true;
};