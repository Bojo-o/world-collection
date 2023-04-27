import { Entity } from "../../DataModels/Entity";

export interface IValueRange {
    max: number | null,
    min: number | null
}
/**
 * Stores range of value quantity.
 */
export class ValueRange {
    max: number;
    min: number;

    constructor({ min, max }: IValueRange) {
        this.max = (max != null) ? max : Number.MAX_VALUE;
        this.min = (min != null) ? min : Number.MIN_VALUE;
    }
}
/**
 * Data model representing property/filter, whose data type is "Quantity".
 */
export class QuantityFilterData {
    /** List of all unit by which can be quantity expressed. */
    supportedUnits: Entity[];
    /** Range of allowed quantity value, which can be used by this filter/property*/
    range: ValueRange;

    constructor(supportedUnits: Entity[], range: ValueRange) {
        this.supportedUnits = supportedUnits;
        this.range = range;
    }
}