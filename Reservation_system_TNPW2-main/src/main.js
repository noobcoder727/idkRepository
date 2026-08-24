import { initRouter } from "./infrastructure/Router.js";
import { authService } from "./infrastructure/Auth.js";
import { runRentalUnitTests } from "./tests/RentalUnit.test.js";
import { handleLoadUnits } from "./infrastructure/Handlers.js";
import { renderApp } from "./infrastructure/Renders.js";

// 1. Restore user session from localStorage
authService.checkPersistence();

// 2. Initialize router (hash-based navigation)
initRouter();

// 3. Load initial data from Mock API - MUST USE AWAIT
await handleLoadUnits();

// 4. Run unit tests (optional, can be removed in production)
runRentalUnitTests();

// 5. Initial render
renderApp();

console.log("Aplikace spuštěna!");




