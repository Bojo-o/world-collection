
import { ComparisonOperator } from "../../Enums/ComparisonOperator";
import { CustomTime } from "../../CustomTime";

/** 
 * Object storing value data for some filter/property, whose data type is Time.
*/
export class TimeValueData{
    /** Comparison operator, which user want to use for filtering restriction. */
    private filterComparisonOperator :  ComparisonOperator;
    /** Time value */
    private time: CustomTime;

    constructor(comparisonOperator: ComparisonOperator,time : CustomTime){
        this.filterComparisonOperator = comparisonOperator;
        this.time = time;
    }

    public getString(){
        return this.time.getString() + " " + this.filterComparisonOperator  + " time value of property"  
    }

    toJSON(){
        return {
            comparisonOperator : this.filterComparisonOperator,
            time : this.time.getString()
        }
    }
}