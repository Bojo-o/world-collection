import { AppliedFilterData } from "../../../Data/FilterModels/AppliedFilterData";
import { FilterIdentificationData } from "../../../Data/FilterModels/FilterIdentificationData";

/**
 * Props necessary for all various filters.
 */
export interface FilterProps {
    /** Data identifying a specific filter. */
    filterData: FilterIdentificationData;
    /**
     * Handle function for adding a used filter. From the parent component, a notification is provided to this component that the new filter has been applied.
     * @param appliedFilter Data containing all necessary data for applied filter.
     */
    handleAddFilterToAplied: (appliedFilter: AppliedFilterData) => void;
}