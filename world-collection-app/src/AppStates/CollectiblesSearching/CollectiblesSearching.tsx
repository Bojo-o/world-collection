import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import FiltersSelection from "./Filters/FiltersSelection";
import TimeFilter from "./Filters/TimeFilter";
import SearchByRadius from "./CollectiblesSearchingStates/SeachByRadius";
import { SearchCollectiblesBuilderQuery } from "../../CollectiblesSearching/SearchCollectiblesQueryBuilder";
import SearchCollectiblesQueryRenderer from "../../CollectiblesSearching/SearchCollectiblesQueryRenderer";
import { Entity } from "../../Data/DataModels/Entity";
import { SearchData } from "../../Data/DataModels/SearchData";
import SearchBar from "../../DataSearching/SearchBar/SearchBar";
import "./CollectiblesSearching.css"
import AreaChoosing from "./CollectiblesSearchingStates/AreaChoosing/AreaChoosing";
import { Areas } from "./CollectiblesSearchingStates/AreaChoosing/Areas";
import { CollectiblesSearchingStates } from "./CollectiblesSearchingStates/CollectiblesSearchingStates";
import TypeChoosing from "./CollectiblesSearchingStates/TypeChoosing";
import SearchByAdministrativeArea from "./CollectiblesSearchingStates/SearchByAdministrativeArea";
import { AppliedFilterData } from "../../Data/FilterModels/AppliedFilterData";
import Collectibles from "./Collectibles";
import { CollectiblesSearchQueryData } from "./ColectiblesSearchQueryData";
import SearchByRegion from "./CollectiblesSearchingStates/SearchByRegion";


function CollectibleSearching(){
    //const [searchQuery,setSearchQuery] = useState<SearchCollectiblesBuilderQuery>(new SearchCollectiblesBuilderQuery());

    const [state,setState] = useState<CollectiblesSearchingStates>(CollectiblesSearchingStates.TypeChoosing)
    const [queryData,setQueryData] = useState<CollectiblesSearchQueryData>(new CollectiblesSearchQueryData())

    const [pickedType,setPickedType] = useState<Entity|null>(null)
    const [pickedExceptionSubTypes,setPickedExceptionSubTypes] = useState<Entity[]>([])

    const [usedFilters,setUsedFilters] = useState<AppliedFilterData[]>([]);
    const handleUsedFiltersChange = (filters : AppliedFilterData[]) => {
        setUsedFilters(filters);
    };
    const typeChoosingStateHandleNext = (type : Entity,exceptionSubTypes : Entity[]) => {
        setQueryData((prev) => prev.setTypeAndExceptionSubTypes(type,exceptionSubTypes))
        if (type.getQNumber() != pickedType?.getQNumber()){
            setUsedFilters([])
        }
        setPickedType(type);
        setPickedExceptionSubTypes(exceptionSubTypes);
        setState(CollectiblesSearchingStates.AreaChoosing)
    }
    const handleSetState = (newState : CollectiblesSearchingStates) => {
        setState(newState);
    }
    const renderTypeChoosingState = () => {
        return(
            <>
                <TypeChoosing handleNext={typeChoosingStateHandleNext} pickedType={pickedType} pickedExceptionSubTypes={pickedExceptionSubTypes}/>
            </>
            
        );
    }
    const areaChoosingStatehandleNext = (areaType : Areas) => {
        
        switch (areaType){
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
                break; } 
        }
    }
    const renderAreaChoosingState = () => {
        return(
            <>
                <div>
                    <button type="button" className="btn btn-secondary" onClick={() => handleSetState(CollectiblesSearchingStates.TypeChoosing)}>Back to type choosing</button>
                </div>
                <AreaChoosing handleSelection={areaChoosingStatehandleNext}/>
            </>
        );
    }
    const radiusAreaStateHandleNext = (center : {lat : number,lng : number}, radius : number) => {
        //setSearchQuery(searchQuery.setRadius(center,radius));
        setQueryData((prev) => prev.setAreaSearchTypeAsRadius(radius,center))
        setState(CollectiblesSearchingStates.FiltersSelection);
    }
    const renderRadiusAreaState = () => {
        return (
            <>
                <SearchByRadius handleNext={radiusAreaStateHandleNext} handleBack={() => handleSetState(CollectiblesSearchingStates.AreaChoosing)}/>
            </>
        )
    }
    const regionAreaStateHandleNext = (region : Entity) => {
        //setSearchQuery(searchQuery.setRadius(center,radius));
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
    const administrativeAreaStateHandleNext = (area : Entity,exceptionSubAreas : Entity[]) => {     
        setState(CollectiblesSearchingStates.FiltersSelection)
        setQueryData((prev) => prev.setAreaSearchTypeAsAdministrative(area,exceptionSubAreas))
    }
    const renderAdministrativeAreaState = () => {
        return (
            <>
                <div>
                    <button type="button" className="btn btn-secondary" onClick={() => handleSetState(CollectiblesSearchingStates.AreaChoosing)}>Back to area choosing</button>
                </div>
                <SearchByAdministrativeArea handleNext={administrativeAreaStateHandleNext}/>
            </>
        )
    }
    const filtersSelectionStateHandleNext = (appliedFilters : AppliedFilterData[]) => {
        setState(CollectiblesSearchingStates.Collectibles)
        setQueryData((prev) => prev.setFilters(appliedFilters));
    }
    const renderFiltersSelectionState = () => {
        return (
            <>
                <FiltersSelection filtersForType={new Entity(queryData.getType(),"filter")}
                handleNext={filtersSelectionStateHandleNext} usedFilters={usedFilters} handleUsedFiltersChange={handleUsedFiltersChange}
                handleBack={() => handleSetState(CollectiblesSearchingStates.AreaChoosing)}/>
            </>
        )
    }
    const renderCollectiblesState = () =>{
        return(
            <>
                <Collectibles queryData={queryData}/>
            </>
        )
    }
    return(
        <>
            <div >
                { state === CollectiblesSearchingStates.TypeChoosing && renderTypeChoosingState()}
                { state === CollectiblesSearchingStates.AreaChoosing && renderAreaChoosingState()}
                { state === CollectiblesSearchingStates.RadiusArea && renderRadiusAreaState()}
                { state === CollectiblesSearchingStates.RegionArea && renderRegionAreaState()}
                { state === CollectiblesSearchingStates.AdministrativeArea && renderAdministrativeAreaState()}
                { state === CollectiblesSearchingStates.FiltersSelection && renderFiltersSelectionState()}
                { state === CollectiblesSearchingStates.Collectibles && renderCollectiblesState()}
            </div>
        </>
    )
}

export default CollectibleSearching;