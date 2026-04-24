
import {initRouter} from "./infrastructure/Router.js";
import { authService } from "./infrastructure/Auth.js";
import { runRentalUnitTests } from "./tests/RentalUnit.test.js";

//je uzivatel z minula prihlaseny?
authService.checkPersistence();

//sledování url hashu, vyvola Navigate
initRouter();

authService.checkPersistence();

runRentalUnitTests();

