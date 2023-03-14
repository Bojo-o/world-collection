import { useState } from "react";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { Entity } from "../../../Data/SearchData/Entity";
import { SearchData } from "../../../Data/SearchData/SearchData";
import SearchBar from "../../../DataSearching/SearchBar/SearchBar";

export interface TypeChoosingProps{
    handleNext : (type : Entity,exceptionSubTypes : Entity[]) => void;
}
function TypeChoosing({handleNext} : TypeChoosingProps){
    const SUPER_TYPE : Entity = new Entity("Q2221906","Anything") // geographic location
    const [type,setType] = useState<Entity|null>(null)
    const [exceptionSubTypes,setExceptionSubTypes] = useState<Entity[]>([])

    const handleAddingTypeChoosing = (data : SearchData) => {
        setType(new Entity(data.QNumber,data.name))
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
    const handleAddingExceptionSubTypeChoosing = (data : SearchData) => {
        setExceptionSubTypes([...exceptionSubTypes,new Entity(data.QNumber,data.name)])
    }
    const handleRemovingExceptionSubTypeChoosing = (entity : Entity) => {
        setExceptionSubTypes((prev) => prev.filter((e) => e.GetQNumber() !== entity.GetQNumber()))
    }
    const typesDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForTypesOfCollectibles(searchWord);
    }
    const subTypesDataGetter = (searchWord : string) => {
        let exceptionSubTypesQNumbers  = exceptionSubTypes.map((type) => { return type.GetQNumber()})
        return WikiDataAPI.searchForTypesOfCollectiblesExceptions(searchWord,type?.GetQNumber(),exceptionSubTypesQNumbers);
    }
    return(
        <>
            <h1>Type of collectibles choosing</h1>
            <div className="d-flex flex-column">
                {type == null ? (
                    <>
                        <h2>Choose what type of collectibles you want to search for</h2>
                        <h6>If you want to search for all possible things, which you can collect, click button "anything"</h6>
                        <div className="d-flex flex-row">
                            <SearchBar placeHolder={"examples : castle, cave, museum"} handleClickedResult={handleAddingTypeChoosing} dataGetter={typesDataGetter} emptySearchingFlag={false}/> 
                            <button type="button" className="btn btn-warning" onClick={handleSuperTypeChoosing}>anything</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="d-flex flex-row">
                            <h1>Choosed type "{type.GetName()}" </h1>
                            <button type="button" className="btn btn-info" onClick={handleResetType} >Choose other</button> 
                        </div>
                        {exceptionSubTypes.length != 0 && (
                            <>
                                <h2>Choosed exception sub types :</h2>
                                <h6>Click red "x" to removing exception</h6>
                                <div className="d-flex flex-row">

                                {exceptionSubTypes.map((exc,index) => {
                                    return(
                                        <div key={index}>
                                            <span className="badge bg-primary mx-1" >{exc.GetName()}
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
                            <SearchBar placeHolder={"Type type of collectibles"} handleClickedResult={handleAddingExceptionSubTypeChoosing} dataGetter={subTypesDataGetter} emptySearchingFlag={true}/>
                        </div>
                        <br/>
                        <div>
                            <button type="button" className="btn btn-success" onClick={() => handleNext(type,exceptionSubTypes)} >Continue</button> 
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
export default TypeChoosing;