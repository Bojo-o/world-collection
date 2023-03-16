
import { FilterComparisonOperator } from "../../AppStates/CollectiblesSearching/Filters/FilterComparisonOperator";


export class FilterQuantityValueData{
    private filterComparisonOperator :  FilterComparisonOperator;
    private value: number;
    private unit : string|null = null;

    constructor(comparisonOperator: FilterComparisonOperator,value : number,unit : string|null){
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