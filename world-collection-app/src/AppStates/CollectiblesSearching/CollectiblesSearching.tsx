import { useState } from "react";
import FiltersSelection from "./Filters/FiltersSelection";
import SearchByRadius from "./CollectiblesSearchingStates/SeachByRadius";
import { Entity } from "../../Data/DataModels/Entity";
import "./CollectiblesSearching.css"
import AreaChoosing from "./CollectiblesSearchingStates/AreaChoosing/AreaChoosing";
import { Areas } from "../../Data/Enums/Areas";
import { CollectiblesSearchingStates } from "../../Data/Enums/CollectiblesSearchingStates";
import TypeChoosing from "./CollectiblesSearchingStates/TypeChoosing";
import SearchByAdministrativeArea from "./CollectiblesSearchingStates/SearchByAdministrativeArea";
import { AppliedFilterData } from "../../Data/FilterModels/AppliedFilterData";
import CollectiblesPresenter from "./CollectiblesPresenter";
import { CollectiblesSearchQueryData } from "../../Data/CollectibleSearching/ColectiblesSearchQueryData";
import SearchByRegion from "./CollectiblesSearchingStates/SearchByRegion";

/**
 * Func managing states of collectible searching process.
 * It stores current state and contains methods for handling going from one state to next state.
 * @returns JSX element with current state of collectible searching process.
 */
function CollectibleSearching() {
    const [state, setState] = useState<CollectiblesSearchingStates>(CollectiblesSearchingStates.TypeChoosing)
    const [queryData, setQueryData] = useState<CollectiblesSearchQueryData>(new CollectiblesSearchQueryData())

    const [selectedType, setSelectedType] = useState<Entity | null>(null)
    const [selectedExceptionSubTypes, setSelectedExceptionSubTypes] = useState<Entity[]>([])

    const [usedFilters, setUsedFilters] = useState<AppliedFilterData[]>([]);
    const handleUsedFiltersChange = (filters: AppliedFilterData[]) => {
        setUsedFilters(filters);
    };
    const typeChoosingStateHandleNext = (type: Entity, exceptionSubTypes: Entity[]) => {
        setQueryData((prev) => prev.setTypeAndExceptionSubTypes(type, exceptionSubTypes))
        if (type.getQNumber() !== selectedType?.getQNumber()) {
            setUsedFilters([])
        }
        setSelectedType(type);
        setSelectedExceptionSubTypes(exceptionSubTypes);
        setState(CollectiblesSearchingStates.AreaChoosing)
    }
    const handleSetState = (newState: CollectiblesSearchingStates) => {
        setState(newState);
    }
    const renderTypeChoosingState = () => {
        return (
            <>
                <TypeChoosing handleNext={typeChoosingStateHandleNext} selectedType={selectedType} selectedExceptionSubTypes={selectedExceptionSubTypes} />
            </>

        );
    }
    const areaChoosingStatehandleNext = (areaType: Areas) => {

        switch (areaType) {
            case Areas.ADMINISTRAVIVE_AREA: {
                setState(CollectiblesSearchingStates.AdministrativeArea)
                break;
            }
            case Areas.RADIUS: {
                setState(CollectiblesSearchingStates.RadiusArea)
                break;
            }
            case Areas.REGION: {
                setState(CollectiblesSearchingStates.RegionArea)
                break;
            }
            case Areas.WORLD: {
                setQueryData((prev) => prev.setAreaSearchTypeAsWorld())
                setState(CollectiblesSearchingStates.FiltersSelection)
                break;
            }
            default: {
                break;
            }
        }
    }
    const renderAreaChoosingState = () => {
        return (
            <>
                <div>
                    <button type="button" className="btn btn-secondary" onClick={() => handleSetState(CollectiblesSearchingStates.TypeChoosing)}>Back to type choosing</button>
                </div>
                <AreaChoosing handleSelection={areaChoosingStatehandleNext} />
            </>
        );
    }
    const radiusAreaStateHandleNext = (center: { lat: number, lng: number }, radius: number) => {
        setQueryData((prev) => prev.setAreaSearchTypeAsRadius(radius, center))
        setState(CollectiblesSearchingStates.FiltersSelection);
    }
    const renderRadiusAreaState = () => {
        return (
            <>
                <SearchByRadius handleNext={radiusAreaStateHandleNext} handleBack={() => handleSetState(CollectiblesSearchingStates.AreaChoosing)} />
            </>
        )
    }
    const regionAreaStateHandleNext = (region: Entity) => {
        setQueryData((prev) => prev.setAreaSearchTypeAsRegion(region))
        setState(CollectiblesSearchingStates.FiltersSelection);
    }
    const renderRegionAreaState = () => {
        return (
            <>
                <div>
                    <button type="button" className="btn btn-secondary" onClick={() => handleSetState(CollectiblesSearchingStates.AreaChoosing)}>Back to area choosing</button>
                </div>
                <SearchByRegion handleNext={regionAreaStateHandleNext} />
            </>
        )
    }
    const administrativeAreaStateHandleNext = (area: Entity, exceptionSubAreas: Entity[]) => {
        setState(CollectiblesSearchingStates.FiltersSelection)
        setQueryData((prev) => prev.setAreaSearchTypeAsAdministrative(area, exceptionSubAreas))
    }
    const renderAdministrativeAreaState = () => {
        return (
            <>
                <div>
                    <button type="button" className="btn btn-secondary" onClick={() => handleSetState(CollectiblesSearchingStates.AreaChoosing)}>Back to area choosing</button>
                </div>
                <SearchByAdministrativeArea handleNext={administrativeAreaStateHandleNext} />
            </>
        )
    }
    const filtersSelectionStateHandleNext = (appliedFilters: AppliedFilterData[]) => {
        setState(CollectiblesSearchingStates.Collectibles)
        setQueryData((prev) => prev.setFilters(appliedFilters));
    }
    const renderFiltersSelectionState = () => {
        return (
            <>
                <FiltersSelection superClass={new Entity(queryData.getType(), "filter")}
                    handleNext={filtersSelectionStateHandleNext} usedFilters={usedFilters} handleUsedFiltersChange={handleUsedFiltersChange}
                    handleBack={() => handleSetState(CollectiblesSearchingStates.AreaChoosing)} />
            </>
        )
    }
    const renderCollectiblesState = () => {
        return (
            <>
                <CollectiblesPresenter dataForWikibaseAPI={queryData} />
            </>
        )
    }
    return (
        <>
            <div >
                {state === CollectiblesSearchingStates.TypeChoosing && renderTypeChoosingState()}
                {state === CollectiblesSearchingStates.AreaChoosing && renderAreaChoosingState()}
                {state === CollectiblesSearchingStates.RadiusArea && renderRadiusAreaState()}
                {state === CollectiblesSearchingStates.RegionArea && renderRegionAreaState()}
                {state === CollectiblesSearchingStates.AdministrativeArea && renderAdministrativeAreaState()}
                {state === CollectiblesSearchingStates.FiltersSelection && renderFiltersSelectionState()}
                {state === CollectiblesSearchingStates.Collectibles && renderCollectiblesState()}
            </div>
        </>
    )
}

export default CollectibleSearching;