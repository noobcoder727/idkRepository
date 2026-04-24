//IR08 Auth - Jan Branda

import {dispatch} from "./Dispatcher.js";

const STORAGE_KEY = "tnpw2_user_session";

export const authService = {
    //simulace přihlášení
    login: (username, role) => {
        const user ={username, role, id: Date.now() //na vytvoření unikátního id
        };
    
    //uložení do paměti
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    dispatch({
        type: "AUTH_LOGIN_SUCCESS",
        payload: {user}
    });
    },
    logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        dispatch({type: "AUTH_LOGOUT"});
    },
    //kontrola při startu apky
    checkPersistence: () => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser){
            const user = JSON.parse(savedUser);
            dispatch({
                type: "AUTH_LOGIN_SUCCESS",
                payload: {user}
            });
        }
    }
};