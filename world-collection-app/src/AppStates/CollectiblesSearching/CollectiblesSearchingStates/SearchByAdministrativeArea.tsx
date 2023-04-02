import { useState } from "react";
import { WikiDataAPI } from "../../../API/WikiDataAPI";
import { Entity } from "../../../Data/SearchData/Entity";
import { SearchData } from "../../../Data/SearchData/SearchData";
import SearchBar from "../../../DataSearching/SearchBar/SearchBar";
import { CollectiblesSearchingStates } from "./CollectiblesSearchingStates";

export interface SearchByAdministrativeAreaProps{
    handleNext : (area : Entity,exceptionSubAreas : Entity[]) => void;
}
function SearchByAdministrativeArea({handleNext} : SearchByAdministrativeAreaProps){
    const [area,setArea] = useState<Entity|null>(null)
    const [exceptionSubAreas,setExceptionSubAreas] = useState<Entity[]>([])

    const areaDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForAdministrativeAreas(searchWord);
    }
    const subAreaDataGetter = (seachWord : string) => {
        let exceptionSubAreasQNumbers = exceptionSubAreas.map((type) => { return type.GetQNumber()})
        return WikiDataAPI.searchForAdministrativeAreasExceptions(seachWord,area?.GetQNumber(),exceptionSubAreasQNumbers)
    }
    const handleAddingArea = (data : SearchData) => {
        setArea(new Entity(data.QNumber,data.name))
        setExceptionSubAreas([])
    }
    const handleResetArea = () => {
        setArea(null)
        setExceptionSubAreas([])
    }
    const handleAddingExceptionSubArea = (data : SearchData) => {
        setExceptionSubAreas([...exceptionSubAreas,new Entity(data.QNumber,data.name)])
    }
    const handleRemovingExceptionSubArea = (entity : Entity) => {
        setExceptionSubAreas((prev) => prev.filter((e) => e.GetQNumber() !== entity.GetQNumber()))
    }
    return (
        <>
            <h1>Administrative area choosing</h1>
            <div className="d-flex flex-column">
                {area == null ? (
                    <div>
                        <h2>Choose the administrative area, in which collectibles will be searched</h2>
                        <SearchBar placeHolder={"Type administrative area, country"} handleClickedResult={handleAddingArea} dataGetter={areaDataGetter} emptySearchingFlag={false}/>  
                    </div>
                ) : (
                    <>
                        <div className="d-flex flex-row">
                            <h1>Choosed area "{area.GetName()}" </h1>
                            <button type="button" className="btn btn-info" onClick={handleResetArea} >Choose other area</button> 
                        </div>
                        {exceptionSubAreas.length != 0 && (
                            <>
                                <h2>Choosed exception administrative sub areas :</h2>
                                <h6>Click red "x" to removing sub area exception</h6>
                                <div className="d-flex flex-row">
                                    {exceptionSubAreas.map((exc,index) => {
                                        return(
                                            <div key={index}>
                                                <span className="badge bg-primary mx-1" >{exc.GetName()}
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
                            <SearchBar placeHolder={"Type administrative area"} handleClickedResult={handleAddingExceptionSubArea} dataGetter={subAreaDataGetter} emptySearchingFlag={true}/>
                        </div>
                        <br/>
                        <div>
                            <button type="button" className="btn btn-success" onClick={() => handleNext(area,exceptionSubAreas)} >Continue</button> 
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default SearchByAdministrativeArea;