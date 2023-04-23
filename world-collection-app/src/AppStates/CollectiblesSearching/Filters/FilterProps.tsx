import { AppliedFilterData } from "../../../Data/FilterModels/AppliedFilterData";
import { FilterIdentificationData } from "../../../Data/FilterModels/FilterIdentificationData";

export interface FilterProps{
    filter : FilterIdentificationData;
    handleAddFilterToAplied : (data : AppliedFilterData) => void;
}