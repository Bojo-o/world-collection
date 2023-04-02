import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import FiltersSelection from "./Filters/FiltersSelection";
import TimeFilter from "./Filters/TimeFilter";
import SearchByRadius from "./CollectiblesSearchingStates/SeachByRadius";
import { SearchCollectiblesBuilderQuery } from "../../CollectiblesSearching/SearchCollectiblesQueryBuilder";
import SearchCollectiblesQueryRenderer from "../../CollectiblesSearching/SearchCollectiblesQueryRenderer";
import { Entity } from "../../Data/SearchData/Entity";
import { SearchData } from "../../Data/SearchData/SearchData";
import SearchBar from "../../DataSearching/SearchBar/SearchBar";
import "./CollectiblesSearching.css"
import AreaChoosing from "./CollectiblesSearchingStates/AreaChoosing/AreaChoosing";
import { Areas } from "./CollectiblesSearchingStates/AreaChoosing/Areas";
import { CollectiblesSearchingStates } from "./CollectiblesSearchingStates/CollectiblesSearchingStates";
import TypeChoosing from "./CollectiblesSearchingStates/TypeChoosing";
import SearchByAdministrativeArea from "./CollectiblesSearchingStates/SearchByAdministrativeArea";
import { AppliedFilterData } from "../../Data/FiltersData/AppliedFilterData";
import Collectibles from "./Collectibles";
import { CollectiblesSearchQueryData } from "./ColectiblesSearchQueryData";
import SearchByRegion from "./CollectiblesSearchingStates/SearchByRegion";


function CollectibleSearching(){
    //const [searchQuery,setSearchQuery] = useState<SearchCollectiblesBuilderQuery>(new SearchCollectiblesBuilderQuery());

    const [state,setState] = useState<CollectiblesSearchingStates>(CollectiblesSearchingStates.TypeChoosing)
    const [queryData,setQueryData] = useState<CollectiblesSearchQueryData>(new CollectiblesSearchQueryData())

    const typeChoosingStateHandleNext = (type : Entity,exceptionSubTypes : Entity[]) => {
        setQueryData((prev) => prev.setTypeAndExceptionSubTypes(type,exceptionSubTypes))
        setState(CollectiblesSearchingStates.AreaChoosing)
    }
    const renderTypeChoosingState = () => {
        return(
            <TypeChoosing handleNext={typeChoosingStateHandleNext}/>
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
                <SearchByRadius handleNext={radiusAreaStateHandleNext}/>
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
                <SearchByRegion handleNext={regionAreaStateHandleNext}/>
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
                <FiltersSelection filtersForType={new Entity(queryData.getType(),"filter")} handleNext={filtersSelectionStateHandleNext}/>
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