//IR04 Router - Jan Branda
import { dispatch } from "./Dispatcher.js";

export const initRouter = () => {
    //hl fce, když se změní adresa
    const handleHashChange = () => {
        //získáme aktuální hash z url (nebo home)
        const currentHash = window.location.hash || "#home";
        //rozdělíme url na části
        const cleanHash = currentHash.replace("#","");
        const [route, id] = cleanHash.split("/");
        //odeslání informace do dispatcheru
        dispatch({
            type: "NAVIGATE",
            payload: {
                route: `#${route}`,
                activeId: id ? parseInt(id, 10) :null
            }
        });
    };
    //eventy prohlížeče
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("load", handleHashChange);
}