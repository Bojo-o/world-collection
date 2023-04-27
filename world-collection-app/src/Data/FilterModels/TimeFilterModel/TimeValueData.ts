
import { ComparisonOperator } from "../../Enums/ComparisonOperator";
import { TimeWithPrecision } from "../../TimeModels/TimeWithPrecision";

/** 
 * Object storing value data for some filter/property, whose data type is Time.
*/
export class TimeValueData {
    /** Comparison operator, which user want to use for filtering restriction. */
    private filterComparisonOperator: ComparisonOperator;
    /** Time value */
    private time: TimeWithPrecision;

    constructor(comparisonOperator: ComparisonOperator, time: TimeWithPrecision) {
        this.filterComparisonOperator = comparisonOperator;
        this.time = time;
    }

    public getString() {
        return this.time.getString() + " " + this.filterComparisonOperator + " time value of property"
    }

    toJSON() {
        return {
            comparisonOperator: this.filterComparisonOperator,
            time: this.time.getString()
        }
    }
}