// IR05 Selektory (výběr dat ze stavu) - Duy Anh Le


/* AUTH */

// aktuální uživatel
export const getCurrentUser = (state) => state.auth.user;

// je admin?
export const isAdmin = (state) => state.auth.user?.role === "admin";


/* UNITS */

// všechna ubytování
export const getAllUnits = (state) => state.rentalUnits;

// pouze aktivní (pro uživatele)
export const getAvailableUnits = (state) =>
    state.rentalUnits.filter(unit => unit.status === "ACTIVE");

// konkrétní ubytování podle ID
export const getUnitById = (state, id) =>
    state.rentalUnits.find(unit => unit.id === id);


/* RESERVATIONS */

// všechny rezervace
export const getAllReservations = (state) => state.reservations;

// moje rezervace (podle přihlášeného uživatele)
export const getMyReservations = (state) => {
    const user = state.auth.user;
    if (!user) return [];

    return state.reservations.filter(r => r.guestId === user.id);
};

// rezervace podle ubytování
export const getReservationsByUnit = (state, unitId) =>
    state.reservations.filter(r => r.unitId === unitId);


/* DERIVED / SMART VALUES */

// může uživatel rezervovat?
export const canUserReserve = (state, unit) => {
    if (!unit) return false;
    if (unit.status !== "ACTIVE") return false;
    if (!state.auth.user) return false;

    return true;
};

// počet rezervací u ubytování
export const getReservationCountForUnit = (state, unitId) =>
    state.reservations.filter(r => r.unitId === unitId).length;