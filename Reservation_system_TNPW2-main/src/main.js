
import { initRouter } from "./infrastructure/Router.js";
import { authService } from "./infrastructure/Auth.js";
import { runRentalUnitTests } from "./tests/RentalUnit.test.js";
import { handleLoadUnits } from "./infrastructure/Handlers.js";
import { renderApp } from "./infrastructure/Renders.js";

// restore session
authService.checkPersistence();

// router
initRouter();

// load initial data
handleLoadUnits();

// run tests (optional)
runRentalUnitTests();

// IMPORTANT: initial render
renderApp();




