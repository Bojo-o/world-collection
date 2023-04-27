import { FilterIdentificationData } from "./FilterIdentificationData";
import { WikibaseItemValueData } from "./WikibaseItemFilterModel/WikibaseItemValueData";
import { QuantityValueData } from "./QuantityFilterModel/QuantityValueData";
import { TimeValueData } from "./TimeFilterModel/TimeValueData";

/**
 * Data model representing filter, which will be applied/used by searching process for colletibles.
 * It stores necessary data about filter, whose will be posted to WikidataAPI.
 */
export class AppliedFilterData {
    /** Data identifying filter. */
    private filter: FilterIdentificationData;
    /** Value of filter. */
    private filterValue: TimeValueData | QuantityValueData | WikibaseItemValueData;

    constructor(filter: FilterIdentificationData, filterValue: TimeValueData | QuantityValueData | WikibaseItemValueData) {
        this.filter = filter;
        this.filterValue = filterValue;
    }

    public getFilter() {
        return this.filter;
    }
    public getValueOfFilter() {
        return this.filterValue;
    }

    toJSON() {
        return {
            property: this.filter.PNumber,
            filterType: this.filter.dataType,
            data: this.filterValue
        }
    }
}
