import { Entity } from "../SearchData/Entity";

export class ValueRange{
    max : number = Number.MAX_VALUE;
    min : number = Number.MIN_VALUE;

    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.max) this.max = initializer.max;
        if (initializer.min) this.min = initializer.min;
    }
}
export class QuantityFilterData{
    supportedUnits : Entity[];
    range : ValueRange;

    constructor(supportedUnits : Entity[],range : ValueRange){
        this.supportedUnits = supportedUnits;
        this.range = range;
    }
}