import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import { Entity } from "../../Data/SearchData/Entity";
import { FilterProps } from "./FilterProps";

function ItemFilter({filter,handleAddFilterToAplied} : FilterProps){
    const[valueTypeConstraint,setValueTypeConstraint] = useState<Entity[]>([]);
    const[loadingValueType,setLoadingValueType] = useState(false);
    const[errorForFetchingValueType,setErrorForFetchingValueType] = useState(false);

    const fetchValueTypeData = () => {
        setLoadingValueType(true)
        setErrorForFetchingValueType(false);

        WikiDataAPI.searchForFilterDataWikibaseItem(filter.PNumber).then(
            (data) => {
                setLoadingValueType(false);
                setValueTypeConstraint(data);
            }
        ).catch(() => setErrorForFetchingValueType(true))
    }
    useEffect(() => {
        fetchValueTypeData()
    },[filter])

    return(
        <div className="m-3">
            <h3>Apply Item filter</h3>
            {loadingValueType && (<>
                <button type="button" className="list-group-item list-group-item-action">{errorForFetchingValueType ? "Some error occurs, try later" : 
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }</button>
            </>)}
            {!loadingValueType && (
                <>
                    <h3>Value type constraint : </h3>
                    <div className="d-flex flex-row">
                        {valueTypeConstraint.map((value,index) => {
                            return (
                                <>
                                    <small key={index} className={"badge bg-warning text-dark text-wrap"}>
                                        {value.GetName()}
                                    </small>
                                </>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}
export default ItemFilter;