import { FilterData } from "./FilterData";
import { FilterTimeValueData } from "./FilterTimeValueData";

export class AppliedFilterData{
    private filter : FilterData;
    private filterValue : FilterTimeValueData | any;

    constructor(filter : FilterData,filterValue : FilterTimeValueData){
        this.filter = filter;
        this.filterValue = filterValue;
    }

    public getFilter(){
        return this.filter;
    }
    public getValueOfFilter(){
        return this.filterValue;
    }
}