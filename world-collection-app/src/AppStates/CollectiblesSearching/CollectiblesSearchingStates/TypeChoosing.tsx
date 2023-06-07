import { useState } from "react";
import { WikiDataAPIProxy } from "../../../API/WikiDataAPIProxy";
import { Entity } from "../../../Data/DataModels/Entity";
import { SearchData } from "../../../Data/DataModels/SearchData";
import SearchBar from "../../../SearchBar/SearchBar";

/**
 * Props necessary for TypeChoosing component.
 */
export interface TypeChoosingProps {
    /**
     * Func from parent component to handle going to the next step of search process.
     * @param type Entity representing selected type/class.
     */
    handleNext: (type: Entity, exceptionSubTypes: Entity[]) => void;
    /** Selected type/class by the user.*/
    selectedType: Entity | null;
    /** Array of selected exceptions types/classes by the user.*/
    selectedExceptionSubTypes: Entity[];
}
/**
 * Func rendering UI for searching allowed types/classes, which can be parent class of collectilbes, exceptions types/classes 
 * (collectible have to be instance of some class, which is sub-class of type/class the user chooese, but exceptions classes
 * are sub-class of that selected class, so it means collectible can not be instance of those exception classes).
 * By allowed we means that those classes, which are sub-class of class "Q2221906 - geographic location".
 * The user want to search for entities, which can be represented as collectibles (the user can visit those entities).
 * So it makes sense to restrict list of possible options to geographic location.
 * Then it contains mechanism for managing selection of class and exception classes.
 * @param TypeChoosingProps See TypeChoosingProps description. 
 * @returns JSX element rendering UI for selecting parent type/class of collectibles.
 */
function TypeChoosing({ handleNext, selectedType, selectedExceptionSubTypes }: TypeChoosingProps) {
    const SUPER_TYPE: Entity = new Entity("Q2221906", "Anything") // geographic location
    const [type, setType] = useState<Entity | null>(selectedType)
    const [exceptionSubTypes, setExceptionSubTypes] = useState<Entity[]>(selectedExceptionSubTypes)

    const handleAddingTypeChoosing = (data: SearchData) => {
        setType(new Entity(data.QNumber, data.name))
        setExceptionSubTypes([])
    }
    const handleResetType = () => {
        setType(null)
        setExceptionSubTypes([])
    }
    const handleSuperTypeChoosing = () => {
        setType(SUPER_TYPE)
        setExceptionSubTypes([])
    }
    const handleAddingExceptionSubTypeChoosing = (data: SearchData) => {
        setExceptionSubTypes([...exceptionSubTypes, new Entity(data.QNumber, data.name)])
    }
    const handleRemovingExceptionSubTypeChoosing = (entity: Entity) => {
        setExceptionSubTypes((prev) => prev.filter((e) => e.getQNumber() !== entity.getQNumber()))
    }
    /**
     * Data getter for Search bar to search for allowed types.
     * @param searchWord Key word used for searching.
     * @returns Found types/classes.
     */
    const typesDataGetter = (searchWord: string) => {
        return WikiDataAPIProxy.searchForTypesOfCollectibles(searchWord);
    }
    /**
     * Data getter for Search bar to search for sub-types ofselected type.
     * @param searchWord Key word used for searching.
     * @returns Found sub types/classes of selected type.
     */
    const subTypesDataGetter = (searchWord: string) => {
        let exceptionSubTypesQNumbers = exceptionSubTypes.map((type) => { return type.getQNumber() })
        return WikiDataAPIProxy.searchForSubTypesOfTypesOfCollectibles(searchWord, (type == null) ? "" : type.getQNumber(), exceptionSubTypesQNumbers);
    }

    return (
        <>

            <div className="d-flex flex-column" >
                <h1>Type of collectibles choosing</h1>
                {type == null ? (
                    <>
                        <h2>Choose what type of collectibles you want to search for</h2>
                        <h6>If you want to search for all possible things, which you can collect, click button "anything"</h6>
                        <div className="d-flex">
                            <button type="button" className="btn btn-warning  btn-sm" onClick={handleSuperTypeChoosing}>Anything</button>
                        </div>

                        <SearchBar placeHolderText={"examples : castle, cave, museum"} handleClickedResult={handleAddingTypeChoosing} dataGetter={typesDataGetter} emptySearchingFlag={false} />
                    </>
                ) : (
                    <>
                        <div className="d-flex">
                            <h1>Choosed type "{type.getName()}" </h1>
                            <button type="button" className="btn btn-info" onClick={handleResetType} >Choose other</button>
                        </div>
                        {exceptionSubTypes.length !== 0 && (
                            <>
                                <h2>Choosed exception sub types :</h2>
                                <h6>Click red "x" to removing exception</h6>
                                <div className="d-flex flex-row">

                                    {exceptionSubTypes.map((exc, index) => {
                                        return (
                                            <div key={index}>
                                                <span className="badge bg-primary mx-1" >{exc.getName()}
                                                    <button type="button" className="btn btn-danger ms-3" onClick={() => handleRemovingExceptionSubTypeChoosing(exc)}>x</button>
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
                {type != null && (
                    <>
                        <div className="border border-secondary rounded">
                            <h3>Also you can choose some sub types, which will be ignored during searching process</h3>
                            <h5>For example: If you choose type "castle", then it also search for castles that are ruined, so if you want to skip these, choose here "castle ruin"</h5>
                            <h5>Clicking on "Show all", it shows you all possible sub types</h5>
                            <h6>Please take in mind that, if you choosed "anything", it would tried to show a large amount of sub types and it takes a very long time to process</h6>
                            <SearchBar placeHolderText={"Type type of collectibles"} handleClickedResult={handleAddingExceptionSubTypeChoosing} dataGetter={subTypesDataGetter} emptySearchingFlag={true} />
                        </div>
                        <br />
                        <div>
                            <button type="button" className="btn btn-success" onClick={() => handleNext(type, exceptionSubTypes)} >Continue</button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
export default TypeChoosing;