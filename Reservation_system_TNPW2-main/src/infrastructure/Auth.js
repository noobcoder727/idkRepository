//IR08 Auth - Jan Branda

//IR08 Auth - Jan Branda

import { dispatch } from "./Dispatcher.js";

const STORAGE_KEY = "tnpw2_user_session";

export const authService = {
    //simulace přihlášení
    login: (username, role) => {
        // Validate role
        if (role !== "admin" && role !== "user") {
            console.warn("Invalid role, defaulting to user");
            role = "user";
        }
        
        const user = {
            username: username, 
            role: role, 
            id: Date.now() //na vytvoření unikátního id
        };
    
        //uložení do paměti
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        dispatch({
            type: "AUTH_LOGIN_SUCCESS",
            payload: { user }
        });
    },
    logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: "AUTH_LOGOUT" });
    },
    //kontrola při startu apky
    checkPersistence: () => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                // Validate the saved user has proper role
                if (user.role && (user.role === "admin" || user.role === "user")) {
                    dispatch({
                        type: "AUTH_LOGIN_SUCCESS",
                        payload: { user }
                    });
                } else {
                    // Invalid role, clear it
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }
};