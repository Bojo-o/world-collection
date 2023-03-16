import { FilterData } from "./FilterData";
import { FilterItemValueData } from "./FilterItemValueData";
import { FilterQuantityValueData } from "./FIlterQuantityValueData";
import { FilterTimeValueData } from "./FilterTimeValueData";

export class AppliedFilterData{
    private filter : FilterData;
    private filterValue : FilterTimeValueData|FilterQuantityValueData|FilterItemValueData;

    constructor(filter : FilterData,filterValue : FilterTimeValueData|FilterQuantityValueData|FilterItemValueData){
        this.filter = filter;
        this.filterValue = filterValue;
    }

    public getFilter(){
        return this.filter;
    }
    public getValueOfFilter(){
        return this.filterValue;
    }

    toJSON(){
        return {
            property : this.filter.PNumber,
            filterType : this.filter.dataType,
            data : this.filterValue
        }
    }
}
