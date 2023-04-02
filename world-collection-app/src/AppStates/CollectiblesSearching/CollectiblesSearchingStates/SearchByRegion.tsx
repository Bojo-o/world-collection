import { useState } from "react";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { Entity } from "../../../Data/SearchData/Entity";
import { SearchData } from "../../../Data/SearchData/SearchData";
import SearchBar from "../../../DataSearching/SearchBar/SearchBar";
import { CollectiblesSearchingStates } from "./CollectiblesSearchingStates";

export interface SearchByRegionProps{
    handleNext : (region : Entity) => void;
}

function SearchByRegion({handleNext} : SearchByRegionProps){
    const [region,setRegion] = useState<Entity|null>(null)
    const regionDataGetter = (searchWord : string) => {
    
        return WikiDataAPI.searchRegions(searchWord);
    }
    const handleClickedRegion = (data : SearchData) => {
        setRegion(new Entity(data.QNumber,data.name))
    }
    return(
        <>
            <h1>Region area choosing</h1>
            <div className="d-flex flex-column">
                <h2>Choose the region area, in which collectibles will be searched</h2>
                <h5>By region its means continent likes "Europe" and sub areas of continents likes "Central Europe" or "East Asia"</h5>
                <h5>Clicking on "Show all", it shows you all possible regions you can choose.</h5>
                <SearchBar placeHolder={"Type region area"} handleClickedResult={handleClickedRegion} dataGetter={regionDataGetter} emptySearchingFlag={true}/>
                {region != null && (
                    <div>
                        <h3>Choosed region "{region.GetName()}"</h3>
                        <button type="button" className="btn btn-success" onClick={() => handleNext(region)} >Continue</button> 
                    </div>
                )}
                
            </div>
        </>
    )
}
export default SearchByRegion;