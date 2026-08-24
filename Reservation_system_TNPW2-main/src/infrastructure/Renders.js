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

// ===== NAVBAR RENDER =====
export const renderNavbar = (state) => {
    const nav = document.createElement("div");
    nav.className = "navbar";

    const brand = document.createElement("div");
    brand.className = "nav-brand";
    brand.innerText = "Ubytovací systém";

    const links = document.createElement("div");
    links.className = "nav-links";

    const homeBtn = document.createElement("button");
    homeBtn.innerText = "Domů";
    homeBtn.className = state.navigation.currentRoute === "#home" ? "active" : "";
    homeBtn.onclick = () => handleNavigate("#home");

    const reservationsBtn = document.createElement("button");
    reservationsBtn.innerText = "Rezervace";
    reservationsBtn.className = state.navigation.currentRoute === "#reservations" ? "active" : "";
    reservationsBtn.onclick = () => handleNavigate("#reservations");

    links.appendChild(homeBtn);
    links.appendChild(reservationsBtn);

    const authSection = document.createElement("div");
    authSection.className = "auth-section";

    if (state.auth.user) {
        const userInfo = document.createElement("span");
        userInfo.innerHTML = `👤 ${state.auth.user.username} <span class="role-badge">${state.auth.user.role}</span>`;

        const logoutBtn = document.createElement("button");
        logoutBtn.className = "btn btn-danger";
        logoutBtn.innerText = "Odhlásit";
        logoutBtn.onclick = handleLogout;

        authSection.appendChild(userInfo);
        authSection.appendChild(logoutBtn);
    } else {
        const loginUserBtn = document.createElement("button");
        loginUserBtn.className = "btn btn-primary";
        loginUserBtn.innerText = "Přihlásit (user)";
        loginUserBtn.onclick = () => {
            import("./Auth.js").then(({ authService }) => {
                authService.login("user", "user");
            });
        };

        const loginAdminBtn = document.createElement("button");
        loginAdminBtn.className = "btn btn-primary";
        loginAdminBtn.innerText = "Přihlásit (admin)";
        loginAdminBtn.onclick = () => {
            import("./Auth.js").then(({ authService }) => {
                authService.login("admin", "admin");
            });
        };

        authSection.appendChild(loginUserBtn);
        authSection.appendChild(loginAdminBtn);
    }

    nav.appendChild(brand);
    nav.appendChild(links);
    nav.appendChild(authSection);

    return nav;
};

// ===== ROOT RENDER =====
export const renderApp = () => {
    const state = getState();
    const root = document.getElementById("app");
    root.innerHTML = "";

    // Render navbar always
    const navbar = renderNavbar(state);
    root.appendChild(navbar);

    // LOADING
    if (state.ui.isLoading) {
        const loading = document.createElement("div");
        loading.className = "loading-container";
        loading.innerHTML = `
            <div class="spinner"></div>
            <p>Načítání...</p>
        `;
        root.appendChild(loading);
        return;
    }

    // ERROR
    if (state.ui.error) {
        const error = document.createElement("div");
        error.className = "error-container";
        error.innerHTML = `
            <strong>Chyba:</strong> ${state.ui.error}
            <br><br>
            <button class="btn btn-primary" onclick="location.reload()">Zkusit znovu</button>
        `;
        root.appendChild(error);
        return;
    }

    // Render content based on route
    switch (state.navigation.currentRoute) {
        case "#home":
            root.appendChild(renderHome(state));
            break;
        case "#reservations":
            root.appendChild(renderReservations(state));
            break;
        case "#unit":
            root.appendChild(renderDetail(state));
            break;
        default:
            const notFound = document.createElement("p");
            notFound.innerText = "Stránka nenalezena";
            root.appendChild(notFound);
    }
};

// Home view (list of units)
export const renderHome = (state) => {
    const container = document.createElement("div");

    const header = document.createElement("div");
    header.className = "page-header";

    const title = document.createElement("h1");
    title.innerText = "Nabídka ubytování";
    header.appendChild(title);
    container.appendChild(header);

    // Reservation form (if logged in)
    if (state.auth.user) {
        const form = document.createElement("div");
        form.className = "reservation-form";
        form.innerHTML = `
            <h3>Vytvořit rezervaci</h3>
            <div class="form-group">
                <div>
                    <label>Ubytování</label>
                    <select id="unitSelect">
                        ${state.rentalUnits.filter(u => u.status === "ACTIVE").map(u => 
                            `<option value="${u.id}">${u.name} (${u.price} Kč)</option>`
                        ).join("")}
                    </select>
                </div>
                <div>
                    <label>Od</label>
                    <input type="date" id="dateFrom" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                    <label>Do</label>
                    <input type="date" id="dateTo" value="${new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]}">
                </div>
                <button class="btn btn-success" onclick="window.createReservation()">Vytvořit rezervaci</button>
            </div>
        `;
        container.appendChild(form);
    } else {
        const loginPrompt = document.createElement("div");
        loginPrompt.className = "reservation-form";
        loginPrompt.innerHTML = `
            <p style="color:#2a69ac;">Pro vytvoření rezervace se prosím přihlaste.</p>
        `;
        container.appendChild(loginPrompt);
    }

    // Unit cards
    const grid = document.createElement("div");
    grid.className = "card-grid";

    state.rentalUnits.forEach(unit => {
        grid.appendChild(renderUnitCard(unit, state));
    });

    container.appendChild(grid);

    return container;
};

// Unit card
export const renderUnitCard = (unit, state) => {
    const card = document.createElement("div");
    card.className = "card";

    const name = document.createElement("h3");
    name.innerText = unit.name;

    const price = document.createElement("p");
    price.className = "price";
    price.innerText = `${unit.price} Kč / noc`;

    const status = document.createElement("p");
    status.className = `status status-${unit.status.toLowerCase()}`;
    status.innerText = unit.status;

    const actions = document.createElement("div");
    actions.className = "actions";

    const detailBtn = document.createElement("button");
    detailBtn.className = "btn btn-primary btn-sm";
    detailBtn.innerText = "Detail";
    detailBtn.onclick = () => handleNavigate("#unit", unit.id);
    actions.appendChild(detailBtn);

    // ADMIN akce
    if (state.auth.user?.role === "admin" && unit.status === "DRAFT") {
        const publishBtn = document.createElement("button");
        publishBtn.className = "btn btn-warning btn-sm";
        publishBtn.innerText = "Publikovat";
        publishBtn.onclick = () => handlePublishUnit(unit.id);
        actions.appendChild(publishBtn);
    }

    if (state.auth.user?.role === "admin" && unit.status === "ACTIVE") {
        const maintenanceBtn = document.createElement("button");
        maintenanceBtn.className = "btn btn-danger btn-sm";
        maintenanceBtn.innerText = "Údržba";
        maintenanceBtn.onclick = () => {
            if (confirm("Přepnout toto ubytování do údržby?")) {
                // You'll need to import handleStartMaintenance
                import("./Handlers.js").then(({ handleStartMaintenance }) => {
                    handleStartMaintenance(unit.id);
                });
            }
        };
        actions.appendChild(maintenanceBtn);
    }

    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(status);
    card.appendChild(actions);

    return card;
};

// Reservations view
export const renderReservations = (state) => {
    const container = document.createElement("div");

    const header = document.createElement("div");
    header.className = "page-header";

    const title = document.createElement("h1");
    title.innerText = "Rezervace";
    header.appendChild(title);
    container.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    const reservations = getAllReservations(state);
    
    if (reservations.length === 0) {
        const empty = document.createElement("p");
        empty.style.color = "#718096";
        empty.innerText = "Zatím žádné rezervace.";
        grid.appendChild(empty);
    } else {
        reservations.forEach(res => {
            grid.appendChild(renderReservationCard(res, state));
        });
    }

    container.appendChild(grid);
    return container;
};

// Reservation card
export const renderReservationCard = (res, state) => {
    const card = document.createElement("div");
    card.className = "card";

    const unit = getUnitById(state, res.unitId);

    const title = document.createElement("h3");
    title.innerText = unit ? unit.name : "Neznámé ubytování";

    const dates = document.createElement("p");
    dates.innerText = `${res.dateFrom} → ${res.dateTo}`;

    const status = document.createElement("p");
    status.className = `status status-${res.status.toLowerCase()}`;
    status.innerText = res.status;

    const actions = document.createElement("div");
    actions.className = "actions";

    // USER může zrušit
    if (res.status !== "CANCELLED") {
        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn btn-danger btn-sm";
        cancelBtn.innerText = "Zrušit";
        cancelBtn.onclick = () => {
            if (confirm("Opravdu chcete zrušit tuto rezervaci?")) {
                handleCancelReservation(res.id);
            }
        };
        actions.appendChild(cancelBtn);
    }

    // ADMIN může schválit
    if (state.auth.user?.role === "admin" && res.status === "CREATED") {
        const approveBtn = document.createElement("button");
        approveBtn.className = "btn btn-success btn-sm";
        approveBtn.innerText = "Schválit";
        approveBtn.onclick = () => handleApproveReservation(res.id);
        actions.appendChild(approveBtn);
    }

    card.appendChild(title);
    card.appendChild(dates);
    card.appendChild(status);
    card.appendChild(actions);

    return card;
};

// Detail view
export const renderDetail = (state) => {
    const container = document.createElement("div");
    container.className = "detail-view";

    const backBtn = document.createElement("button");
    backBtn.className = "btn btn-outline back-btn";
    backBtn.innerText = "← Zpět";
    backBtn.onclick = () => handleNavigate("#home");
    container.appendChild(backBtn);

    const unit = getUnitById(state, state.navigation.activeId);

    if (!unit) {
        const notFound = document.createElement("p");
        notFound.innerText = "Ubytování nenalezeno";
        container.appendChild(notFound);
        return container;
    }

    const title = document.createElement("h1");
    title.innerText = unit.name;
    container.appendChild(title);

    const infoGrid = document.createElement("div");
    infoGrid.className = "info-grid";

    const infoItems = [
        { label: "Cena za noc", value: `${unit.price} Kč` },
        { label: "Status", value: unit.status },
        { label: "ID", value: unit.id }
    ];

    infoItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "info-item";
        div.innerHTML = `
            <label>${item.label}</label>
            <value>${item.value}</value>
        `;
        infoGrid.appendChild(div);
    });

    container.appendChild(infoGrid);

    // Show reservations for this unit
    const reservations = state.reservations.filter(r => r.unitId === unit.id);
    if (reservations.length > 0) {
        const resTitle = document.createElement("h3");
        resTitle.innerText = "Rezervace tohoto ubytování";
        container.appendChild(resTitle);

        const resList = document.createElement("ul");
        reservations.forEach(r => {
            const li = document.createElement("li");
            li.innerText = `${r.dateFrom} → ${r.dateTo} (${r.status})`;
            resList.appendChild(li);
        });
        container.appendChild(resList);
    }

    return container;
};

// Make createReservation available globally for the form
// Make createReservation available globally for the form
window.createReservation = async () => {
    const unitSelect = document.getElementById("unitSelect");
    const dateFrom = document.getElementById("dateFrom");
    const dateTo = document.getElementById("dateTo");

    if (!unitSelect || !dateFrom || !dateTo) {
        alert("Prosím vyplňte všechny údaje");
        return;
    }

    const unitId = parseInt(unitSelect.value);
    if (isNaN(unitId)) {
        alert("Prosím vyberte platné ubytování");
        return;
    }

    const data = {
        unitId: unitId,
        dateFrom: dateFrom.value,
        dateTo: dateTo.value,
        guestId: getState().auth.user?.id || Date.now()
    };

    // Validate dates
    if (new Date(data.dateTo) <= new Date(data.dateFrom)) {
        alert("Datum odjezdu musí být pozdější než datum příjezdu");
        return;
    }

    await handleCreateReservation(data);
};

