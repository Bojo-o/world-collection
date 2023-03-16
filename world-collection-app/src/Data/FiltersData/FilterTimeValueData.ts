
import { FilterComparisonOperator } from "../../AppStates/CollectiblesSearching/Filters/FilterComparisonOperator";
import { CustomTime } from "../CustomTime";


export class FilterTimeValueData{
    private filterComparisonOperator :  FilterComparisonOperator;
    private time: CustomTime;

    constructor(comparisonOperator: FilterComparisonOperator,time : CustomTime){
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