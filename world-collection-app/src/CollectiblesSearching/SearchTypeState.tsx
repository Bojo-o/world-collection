import { WikiDataAPI } from "../API/WikiDataAPI";
import CollectibleSearching from "../AppStates/CollectiblesSearching";
import { SearchData } from "../Data/SearchData/SearchData"
import SearchBar from "../DataSearching/SearchBar/SearchBar"

export interface SearchTypeStateProps{
    handleCollectibleType : (data : SearchData) => void;
}
function SearchTypeState({handleCollectibleType} : SearchTypeStateProps){
    const typesDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForTypesOfCollectibles(searchWord);
    }
    return(
        <>  
            <div className="d-flex flex-column">
                <h1>Choose what type of collectibles you want to search for</h1>
                <SearchBar placeHolder={"Type type of collectibles"} handleClickedResult={handleCollectibleType} dataGetter={typesDataGetter}/>  
            </div>
        </>

    )
}

export default SearchTypeState