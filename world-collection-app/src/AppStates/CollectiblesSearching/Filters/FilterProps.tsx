import { AppliedFilterData } from "../../../Data/FiltersData/AppliedFilterData";
import { FilterData } from "../../../Data/FiltersData/FilterData";

export interface FilterProps{
    filter : FilterData;
    handleAddFilterToAplied : (data : AppliedFilterData) => void;
}