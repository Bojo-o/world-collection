
import { ComparisonOperator } from "../../Enums/ComparisonOperator";

/** 
 * Object storing value data for some filter/property, whose data type is Quantity.
*/
export class QuantityValueData{
    /** Comparison operator, which user want to use for filtering restriction. */
    private filterComparisonOperator :  ComparisonOperator;
    /** Quantity of value*/
    private value: number;
    /** QNUmber of unit, in which is value setted. */
    private unit : string|null = null;

    constructor(comparisonOperator: ComparisonOperator,value : number,unit : string|null){
        this.filterComparisonOperator = comparisonOperator;
        this.value = value;
        this.unit = unit
    }

    public getString(){
        return this.value + " " + this.filterComparisonOperator  + " quantity value of property"  
    }
    toJSON(){
        return {
            comparisonOperator : this.filterComparisonOperator,
            value: this.value,
            unit : this.unit
        }
    }
    
}