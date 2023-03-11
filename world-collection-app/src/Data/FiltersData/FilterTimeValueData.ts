import { FilterType } from "../../CollectiblesSearching/Filters/TimeFilter";
import { CustomTime } from "../CustomTime";


export class FilterTimeValueData{
    private filterType :  FilterType;
    private timeFrom : CustomTime;
    private timeTo : CustomTime | null;

    constructor(filterType: FilterType,timeFrom : CustomTime,timeTo : CustomTime | null = null){
        this.filterType = filterType;
        this.timeFrom = timeFrom;
        this.timeTo = timeTo;
    }
    
}