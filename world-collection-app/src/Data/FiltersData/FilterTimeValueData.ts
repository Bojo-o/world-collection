
import { FilterComparisonOperator } from "../../AppStates/CollectiblesSearching/Filters/FilterComparisonOperator";
import { CustomTime } from "../CustomTime";


export class FilterTimeValueData{
    private filterType :  FilterComparisonOperator;
    private timeFrom : CustomTime;
    private timeTo : CustomTime | null;

    constructor(filterType: FilterComparisonOperator,timeFrom : CustomTime,timeTo : CustomTime | null = null){
        this.filterType = filterType;
        this.timeFrom = timeFrom;
        this.timeTo = timeTo;
    }
    
}