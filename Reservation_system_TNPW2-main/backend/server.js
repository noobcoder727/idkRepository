const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory database
let units = [
    { id: 1, name: "Byt Praha", price: 1200, status: "ACTIVE" },
    { id: 2, name: "Chata Beskydy", price: 900, status: "DRAFT" }
];

let reservations = [];
let nextId = 3;

// GET all units
app.get('/api/units', (req, res) => {
    res.json(units);
});

// GET single unit
app.get('/api/units/:id', (req, res) => {
    const unit = units.find(u => u.id === parseInt(req.params.id));
    if (!unit) return res.status(404).json({ error: 'Unit not found' });
    res.json(unit);
});

// POST create reservation
app.post('/api/reservations', (req, res) => {
    const reservation = {
        id: nextId++,
        ...req.body,
        status: 'CREATED',
        createdAt: new Date().toISOString()
    };
    reservations.push(reservation);
    res.status(201).json(reservation);
});

// GET all reservations
app.get('/api/reservations', (req, res) => {
    res.json(reservations);
});

// PATCH update reservation
app.patch('/api/reservations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: 'Reservation not found' });
    
    reservations[index] = { ...reservations[index], ...req.body };
    res.json(reservations[index]);
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});