import CollectibleSearching from "../AppStates/CollectiblesSearching";
import { SearchData } from "../Data/SearchData/SearchData"
import SearchBar from "../DataSearching/SearchBar/SearchBar"

export interface SearchTypeStateProps{
    handleCollectibleType : (data : SearchData) => void;
}
function SearchTypeState({handleCollectibleType} : SearchTypeStateProps){

    return(
        <>  
            <div className="d-flex flex-column">
                <h1>Choose what type of collectibles you want to search for</h1>
                <SearchBar placeHolder={"Type type of collectibles"} handleClickedResult={handleCollectibleType} />  
            </div>
        </>

    )
}

export default SearchTypeState