import { useState } from "react";
import { WikiDataAPIProxy } from "../../../API/WikiDataAPIProxy";
import { Entity } from "../../../Data/DataModels/Entity";
import { SearchData } from "../../../Data/DataModels/SearchData";
import SearchBar from "../../../SearchBar/SearchBar";


/**
 * Props necessary for SeachByRegion component.
 */
export interface SearchByRegionProps {
    /**
     * Func from parent component to handle going to the next step of search process.
     * @param region Entity representing selected region.
     */
    handleNext: (region: Entity) => void;
}

/**
 * Func rendering UI for searching and then selecting region for collectilbe search query.
 * By regions we mean like Europe , East Asia ... (no country or administative areas).
 * @param SearchByRegionProps See SearchByRegionProps description.
 * @returns JSX element rendering UI for region selection.
 */
function SearchByRegion({ handleNext }: SearchByRegionProps) {
    const [region, setRegion] = useState<Entity | null>(null)
    /**
     * Data getter for Search bar to search for regions.
     * @param searchWord Key word used for searching.
     * @returns Found regions.
     */
    const regionDataGetter = (searchWord: string) => {

        return WikiDataAPIProxy.searchForRegions(searchWord);
    }
    const handleClickedRegion = (data: SearchData) => {
        setRegion(new Entity(data.QNumber, data.name))
    }
    return (
        <>
            <h1>Region area choosing</h1>
            <div className="d-flex flex-column">
                <h2>Choose the region area, in which collectibles will be searched</h2>
                <h5>By region its means continent likes "Europe" and sub areas of continents likes "Central Europe" or "East Asia"</h5>
                <h5>Clicking on "Show all", it shows you all possible regions you can choose.</h5>
                <SearchBar placeHolderText={"Type region area"} handleClickedResult={handleClickedRegion} dataGetter={regionDataGetter} emptySearchingFlag={true} />
                {region != null && (
                    <div>
                        <h3>Choosed region "{region.getName()}"</h3>
                        <button type="button" className="btn btn-success" onClick={() => handleNext(region)} >Continue</button>
                    </div>
                )}

            </div>
        </>
    )
}
export default SearchByRegion;