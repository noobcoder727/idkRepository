//IR01 Správa stavu - Jan Branda

import { renderApp } from "./render.js";

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


// pro selektory (IR05)
export const getState = () => currentState;


//volat může jenom dispatcher, UI update trigger (IR06)
export const setState = (newState) => {
  currentState = { ...currentState, ...newState };
  
  renderApp();
};