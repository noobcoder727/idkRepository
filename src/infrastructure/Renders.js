// IR06 – Renderovací logika (View composition) - Duy Anh Le
import { getState } from "./State.js";
import { getUnitById } from "./Selectors.js";
import { getAllReservations } from "./Selectors.js";
import { isAdmin } from "./Selectors.js";
import {
    handlePublishUnit,
    handleCreateReservation,
    handleApproveReservation,
    handleCancelReservation,
    handleNavigate,
    handleLogout
} from "./Handlers.js";


/* ROOT RENDER */

const renderApp = () => {
    const state = getState();
    const root = document.getElementById("app");
    root.innerHTML = "";

    // LOADING
    if (state.ui.isLoading) {
        root.innerHTML = "<p>Loading...</p>";
        return;
    }

    // ERROR
    if (state.ui.error) {
        root.innerHTML = `<p style="color:red">${state.ui.error}</p>`;
        return;
    }
};

// Home view (list of units)
const renderHome = (state) => {
    const container = document.createElement("div");

    const title = document.createElement("h1");
    title.innerText = "Nabídka ubytování";
    container.appendChild(title);

    state.rentalUnits.forEach(unit => {
        container.appendChild(renderUnitCard(unit, state));
    });

    return container;
};

// Unit card
const renderUnitCard = (unit, state) => {
    const card = document.createElement("div");
    card.className = "card";

    const name = document.createElement("h3");
    name.innerText = unit.name;

    const price = document.createElement("p");
    price.innerText = `${unit.price} Kč / noc`;

    const status = document.createElement("p");
    status.innerText = `Stav: ${unit.status}`;

    // tlačítko detail
    const detailBtn = document.createElement("button");
    detailBtn.innerText = "Detail";
    detailBtn.onclick = () => handleNavigate("#unit", unit.id);

    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(status);
    card.appendChild(detailBtn);

    // ADMIN akce
    if (state.auth.user?.role === "admin" && unit.status === "DRAFT") {
        const publishBtn = document.createElement("button");
        publishBtn.innerText = "Publikovat";
        publishBtn.onclick = () => handlePublishUnit(unit.id);
        card.appendChild(publishBtn);
    }

    return card;
};

// Reservations view
const renderReservations = (state) => {
    const container = document.createElement("div");

    const title = document.createElement("h1");
    title.innerText = "Rezervace";
    container.appendChild(title);

    getAllReservations(state).forEach(res =>
        container.appendChild(renderReservationCard(res, state))
    );

    return container;
};

// Reservation card
const renderReservationCard = (res, state) => {
    const card = document.createElement("div");
    card.className = "card";

    const unit = getUnitById(state, state.navigation.activeId);

    const title = document.createElement("h3");
    title.innerText = unit ? unit.name : "Unknown";

    const dates = document.createElement("p");
    dates.innerText = `${res.dateFrom} → ${res.dateTo}`;

    const status = document.createElement("p");
    status.innerText = `Status: ${res.status}`;

    card.appendChild(title);
    card.appendChild(dates);
    card.appendChild(status);

    // USER může zrušit
    if (res.status !== "CANCELLED") {
        const cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Zrušit";
        cancelBtn.onclick = () => handleCancelReservation(res.id);
        card.appendChild(cancelBtn);
    }

    // ADMIN může schválit
    if (state.auth.user?.role === "admin" && res.status === "CREATED") {
        const approveBtn = document.createElement("button");
        approveBtn.innerText = "Schválit";
        approveBtn.onclick = () => handleApproveReservation(res.id);
        card.appendChild(approveBtn);
    }

    return card;
};