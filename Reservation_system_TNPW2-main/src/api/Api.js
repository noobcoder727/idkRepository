// IR03 Real API - Duy Anh Le

/*const API_BASE = 'http://localhost:3001/api';

export const api = {
    fetchUnits: async () => {
        const response = await fetch(`${API_BASE}/units`);
        if (!response.ok) throw new Error('Nepodařilo se načíst ubytování');
        return response.json();
    },

    fetchUnit: async (id) => {
        const response = await fetch(`${API_BASE}/units/${id}`);
        if (!response.ok) throw new Error('Nepodařilo se načíst ubytování');
        return response.json();
    },

    createReservation: async (reservation) => {
        const response = await fetch(`${API_BASE}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation)
        });
        if (!response.ok) throw new Error('Nepodařilo se vytvořit rezervaci');
        return response.json();
    },

    updateReservation: async (id, changes) => {
        const response = await fetch(`${API_BASE}/reservations/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(changes)
        });
        if (!response.ok) throw new Error('Nepodařilo se aktualizovat rezervaci');
        return response.json();
    }
};*/