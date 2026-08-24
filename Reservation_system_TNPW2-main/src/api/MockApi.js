// IR03 Mock API - Duy Anh Le

// simulace delaye
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// mock databáze
let mockUnits = [
    { id: 1, name: "Byt Praha", price: 1200, status: "ACTIVE" },
    { id: 2, name: "Chata Beskydy", price: 900, status: "DRAFT" }
];

let mockReservations = [];

// API funkce

export const api = {

    // GET units
    fetchUnits: async () => {
        await delay(1000);

        // simulace chyby (10% chance)
        if (Math.random() < 0.1) {
            throw new Error("Nepodařilo se načíst ubytování");
        }

        return mockUnits;
    },

    // POST reservation
    createReservation: async (reservation) => {
        await delay(800);

        if (!reservation.unitId) {
            throw new Error("Neplatná rezervace");
        }

        mockReservations.push(reservation);
        return reservation;
    },

    // PATCH reservation
    updateReservation: async (id, changes) => {
        await delay(600);

        mockReservations = mockReservations.map(r =>
            r.id === id ? { ...r, ...changes } : r
        );

        return mockReservations.find(r => r.id === id);
    }
};