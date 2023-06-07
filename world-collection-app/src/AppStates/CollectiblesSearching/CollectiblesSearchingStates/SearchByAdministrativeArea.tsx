import { useState } from "react";
import { WikiDataAPIProxy } from "../../../API/WikiDataAPIProxy";
import { Entity } from "../../../Data/DataModels/Entity";
import { SearchData } from "../../../Data/DataModels/SearchData";
import SearchBar from "../../../SearchBar/SearchBar";

/**
 * Props necessary for SearchByAdministrativeArea component.
 */
export interface SearchByAdministrativeAreaProps {
    /**
     * Func from parent component to handle going to the next step of search process.
     * @param area Entity representing selected administrative area.
     * @param exceptionSubAreas Array of enities representing area exceptions. Found collectibles can not locate in those areas.
     */
    handleNext: (area: Entity, exceptionSubAreas: Entity[]) => void;
}
/**
 * Func rendering UI for searching and then selecting administrative area for collectilbe search query.
 * It also allows to the user to select some exceptions area, which are areas located in selected administravive area.
 * In those exceptions area found collectibles can not locate.
 * By administrative area we mean like countries and then their sub administrave areas.
 * @param SearchByAdministrativeAreaProps See SearchByAdministrativeAreaProps description.
 * @returns JSX element rendering UI for administrative area selection.
 */
function SearchByAdministrativeArea({ handleNext }: SearchByAdministrativeAreaProps) {
    const [area, setArea] = useState<Entity | null>(null)
    const [exceptionSubAreas, setExceptionSubAreas] = useState<Entity[]>([])
    /**
     * Data getter for Search bar to search for administrative area.
     * @param searchWord Key word used for searching.
     * @returns Found administrative areas.
     */
    const areaDataGetter = (searchWord: string) => {
        return WikiDataAPIProxy.searchForAdministrativeAreas(searchWord);
    }
    /**
     * Data getter for Search bar to search for administrative area exceptions, which locate in selected area.
     * @param searchWord Key word used for searching.
     * @returns Found administrative areas.
     */
    const subAreaDataGetter = (seachWord: string) => {
        let exceptionSubAreasQNumbers = exceptionSubAreas.map((type) => { return type.getQNumber() })
        return WikiDataAPIProxy.searchForSubAdministrativeAreasOfArea(seachWord, (area != null) ? area.getQNumber() : null, exceptionSubAreasQNumbers)
    }
    const handleAddingArea = (data: SearchData) => {
        setArea(new Entity(data.QNumber, data.name))
        setExceptionSubAreas([])
    }
    const handleResetArea = () => {
        setArea(null)
        setExceptionSubAreas([])
    }
    const handleAddingExceptionSubArea = (data: SearchData) => {
        setExceptionSubAreas([...exceptionSubAreas, new Entity(data.QNumber, data.name)])
    }
    const handleRemovingExceptionSubArea = (entity: Entity) => {
        setExceptionSubAreas((prev) => prev.filter((e) => e.getQNumber() !== entity.getQNumber()))
    }
    return (
        <>
            <h1>Administrative area choosing</h1>
            <div className="d-flex flex-column">
                {area == null ? (
                    <div>
                        <h2>Choose the administrative area, in which collectibles will be searched</h2>
                        <SearchBar placeHolderText={"Type administrative area, country"} handleClickedResult={handleAddingArea} dataGetter={areaDataGetter} emptySearchingFlag={false} />
                    </div>
                ) : (
                    <>
                        <div className="d-flex flex-row">
                            <h1>Choosed area "{area.getName()}" </h1>
                            <button type="button" className="btn btn-info" onClick={handleResetArea} >Choose other area</button>
                        </div>
                        {exceptionSubAreas.length !== 0 && (
                            <>
                                <h2>Choosed exception administrative sub areas :</h2>
                                <h6>Click red "x" to removing sub area exception</h6>
                                <div className="d-flex flex-row">
                                    {exceptionSubAreas.map((exc, index) => {
                                        return (
                                            <div key={index}>
                                                <span className="badge bg-primary mx-1" >{exc.getName()}
                                                    <button type="button" className="btn btn-danger ms-3" onClick={() => handleRemovingExceptionSubArea(exc)}>x</button>
                                                </span>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </>
                        )}
                    </>
                )}

                {area != null && (
                    <>
                        <div className="border border-secondary rounded">
                            <h2>Also you can choose some sub areas, which will be ignored during searching process.</h2>
                            <h5>Clicking on "Show all", it shows you all possible sub areas, but only one level below.</h5>
                            <SearchBar placeHolderText={"Type administrative area"} handleClickedResult={handleAddingExceptionSubArea} dataGetter={subAreaDataGetter} emptySearchingFlag={true} />
                        </div>
                        <br />
                        <div>
                            <button type="button" className="btn btn-success" onClick={() => handleNext(area, exceptionSubAreas)} >Continue</button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default SearchByAdministrativeArea;