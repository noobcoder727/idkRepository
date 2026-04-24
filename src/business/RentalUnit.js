//business logika - Jan Branda

//ochrana
export const validateUnit = (unit) => {
    if (unit.price <= 0) {
        throw new Error("Cena za noc musí být větší než 0!");
    }
    return true;
}

//draft -> active
export const publishUnit = (unit) => {
    if (unit.status !== "DRAFT") {
        throw new Error("Publikovat lze pouze ubytování ve stavu DRAFT!")
    }
    validateUnit(unit);
    return {...unit, status: "ACTIVE"};
}

//active -> maintenance
export const startMaintenance = (unit) => {
    if (unit.status !== "ACTIVE"){
        throw new Error("Do údržby lze dát pouze ubytování ve stavu ACTIVE!")
    } 
    return{...unit, status: "MAINTENANCE"};
}