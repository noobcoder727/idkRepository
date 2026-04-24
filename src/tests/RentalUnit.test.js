// testy - Jan Branda
import { publishUnit, startMaintenance } from "../business/RentalUnit.js";

export const runRentalUnitTests = () => {
    console.log("spouštím testy");

    //test DRAFT -> ACCTIVE
    const draftUnit = {
        id: 1,
        status: "DRAFT",
        price: 1500
    };
    const publishedUnit = publishUnit(draftUnit);

    console.assert(
        publishUnit.status === "ACTIVE", "Test selhal, ubytování není ve stavu ACTIVE"
    );


    //test - cena > 0
    const freeUnit = {
        id: 2,
        status: "DRAFT",
        price: 0
    };
    let priceErrorThrown = false;

    try {
        publishUnit(freeUnit);
    } catch (error) {
        priceErrorThrown = true;
    };
    console.assert(
        priceErrorThrown === true, "test selhal, publikováno ubytko za 0"
    );
    
    //test - publikování occupied
    const occupiedUnit = {
        id: 3,
        status: "OCCUPIED",
        price: 2000
    };
    let statusErrorThrown = false;

    try{
        publishUnit(occupiedUnit);
    } catch (error) {
        statusErrorThrown = true;
    }
    console.assert(
        statusErrorThrown === true, "test selhal, publikováno obsazené ubytko"
    );

    console.log("testy dokončeny");

}