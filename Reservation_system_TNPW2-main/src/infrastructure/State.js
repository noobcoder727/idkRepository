//IR01 Správa stavu - Jan Branda

/*import { renderApp } from "./Renders.js";
import { getState } from "./State.js";

//volat může jenom dispatcher, UI update trigger (IR06)
export const renderApp = () => {
  const state = getState();
  const root = document.getElementById("app");
  root.innerHTML = "";

  if (state.ui.isLoading) {
      root.innerHTML = "<p>Loading...</p>";
      return;
  }

  if (state.ui.error) {
      root.innerHTML = `<p style="color:red">${state.ui.error}</p>`;
      return;
  }

  switch (state.navigation.currentRoute) {
      case "#home":
          root.appendChild(renderHome(state));
          break;

      case "#reservations":
          root.appendChild(renderReservations(state));
          break;

      default:
          root.innerHTML = "<p>Page not found</p>";
  }
};

export const initialState = {
  
//seznam ubytování
  rentalUnits: [], 
  
  
  //seznam rezervací. každý objekt: id, unitId, guestId, status, dateFrom, dateTo, totalPrice
  reservations: [], 

  
  //aktuálně přihlášen a role (IR08)
  auth: {
    user: null, 
    token: null 
  },

  //IR04 - router
  navigation: {
    currentRoute: '#home', 
    activeId: null        
  },


  // pomocné stavy pro asynchronní operace a loadingy 
  ui: {
    isLoading: false,      // Zda se zrovna stahují data z Mock API
    error: null            // Případná chybová hláška pro zobrazení uživateli
  }
};


let currentState = { ...initialState };

let state = {
  rentalUnits: [],
  reservations: [],
  auth: { user: null },
  ui: { isLoading: false, error: null },
  navigation: { currentRoute: "#home", activeId: null }
};

export const getState = () => state;

export const setState = (newState) => {
  state = { ...state, ...newState };
  renderApp(); // 🔥 auto rerender
};

// pro selektory (IR05)
//export const getState = () => currentState;*/

import { renderApp } from "./Renders.js";

export const initialState = {
    //seznam ubytování
    rentalUnits: [], 
    
    //seznam rezervací. každý objekt: id, unitId, guestId, status, dateFrom, dateTo, totalPrice
    reservations: [], 
    
    //aktuálně přihlášen a role (IR08)
    auth: {
        user: null, 
        token: null 
    },

    //IR04 - router
    navigation: {
        currentRoute: '#home', 
        activeId: null        
    },

    // pomocné stavy pro asynchronní operace a loadingy 
    ui: {
        isLoading: false,      // Zda se zrovna stahují data z Mock API
        error: null            // Případná chybová hláška pro zobrazení uživateli
    }
};

let state = { ...initialState };

export const getState = () => state;

export const setState = (newState) => {
  console.log("setState: Updating state from:", state);
  console.log("setState: New state:", newState);
  state = { ...state, ...newState };
  console.log("setState: Final state:", state);
  renderApp(); // auto rerender
};
/*export const setState = (newState) => {
    state = { ...state, ...newState };
    renderApp(); // auto rerender
};*/