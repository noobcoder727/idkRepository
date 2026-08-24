//IR02 centrální zpracování akcí - Jan Branda
import { getState, setState } from "./State.js";

export const dispatch = (action) => {
    const currentState = getState();
    
    switch (action.type) {
        //akce pro entitu RentalUnit
        case "PUBLISH_UNIT": {
            const newUnits = currentState.rentalUnits.map(unit => 
                unit.id === action.payload.unitID ? {
                    ...unit, 
                    status: "ACTIVE"
                } : unit
            );
            setState({
                ...currentState, 
                rentalUnits: newUnits
            });
            break;
        }
        //akce pro IR03 - Async (tony)
        case "API_CALL_START": {
            setState({
                ...currentState, 
                ui: {...currentState.ui, isLoading: true, error: null}
            });
            break;
        }
        case "API_CALL_SUCCESS": {
            /*setState({
                ...currentState, 
                rentalUnits: action.payload.units,
                ui: {...currentState.ui, isLoading: false, error: null}
            });
            break;*/
            console.log("Dispatcher: API_CALL_SUCCESS received");
            console.log("Dispatcher: action:", action);
            console.log("Dispatcher: action.payload:", action.payload);
            console.log("Dispatcher: action.payload?.units:", action.payload?.units);
            
            // Add safety check
            const units = action.payload?.units || [];
            console.log("Dispatcher: units to set:", units);
            
            setState({
                ...currentState,
                rentalUnits: units,
                ui: {
                    ...currentState.ui, 
                    isLoading: false, 
                    error: null
                }
            });
            console.log("Dispatcher: State updated");
            break;
        }
        case "NAVIGATE": {
            setState({
                ...currentState,  // <-- ADD THIS
                navigation: {
                    currentRoute: action.payload.route,
                    activeId: action.payload.activeId
                }
            });
            break;
        }
        case "AUTH_LOGIN_SUCCESS": {
            setState({
                ...currentState,  // <-- ADD THIS
                auth: { ...currentState.auth, user: action.payload.user }
            });
            break;
        }
        case "AUTH_LOGOUT": {
            setState({
                ...currentState,  // <-- ADD THIS
                auth: { ...currentState.auth, user: null }
            });
            break;
        }
        case "CREATE_RESERVATION": {
            const newReservations = [...currentState.reservations, action.payload];
            setState({
                ...currentState,  // <-- ADD THIS
                reservations: newReservations
            });
            break;
        }
    
        case "APPROVE_RESERVATION": {
            const updated = currentState.reservations.map(r =>
                r.id === action.payload.reservationId
                    ? { ...r, status: "APPROVED" }
                    : r
            );
            setState({
                ...currentState,  // <-- ADD THIS
                reservations: updated
            });
            break;
        }
        case "CANCEL_RESERVATION": {
            const updated = currentState.reservations.map(r =>
                r.id === action.payload.reservationId
                    ? { ...r, status: "CANCELLED" }
                    : r
            );
            setState({
                ...currentState,  // <-- ADD THIS
                reservations: updated
            });
            break;
        }

        case "API_CALL_ERROR": {
            setState({
                ...currentState,  // <-- Already has this, good!
                ui: {
                    ...currentState.ui,
                    isLoading: false,
                    error: action.payload.error
                }
            });
            break;
        }

        case "START_MAINTENANCE": {
            const updated = currentState.rentalUnits.map(unit =>
                unit.id === action.payload.unitID
                    ? { ...unit, status: "MAINTENANCE" }
                    : unit
            );
            setState({
                ...currentState,  // <-- ADD THIS
                rentalUnits: updated
            });
            break;
        }

        default:
            console.warn(`Neznámá akce: ${action.type}`);
    }
}