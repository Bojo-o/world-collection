import { useState } from "react";
import { Collection } from "../Data/Database/Colection";
import { DatabaseAPI } from "../API/DatabaseAPI";
import LoadingStatus from "../Gadgets/LoadingStatus";

export interface CollectionCreationProps{
    collection : Collection[];
    handleCancel : () => void;
}
function CollectionCreation({collection,handleCancel} : CollectionCreationProps){
    const [value,setValue] = useState<string>('')
    const [savingCollection,setSavingCollection] = useState(false);
    const [savingCollectionError,setSavingCollectionError] = useState(false);
    const [status,setStatus] = useState<string|null>(null);

    const handleChange = (event : any) => {
        const value = event.target.value;
        setValue(value);
    }
    const existCollectionByThisName = (name : string) => {
        let result = false;
        collection.forEach((c) => {
            if (c.name === name){
                result = true;
            }
        })
        return result;
    }
    const saveCollection = () => {
        setSavingCollectionError(false)
        setSavingCollection(true)
        DatabaseAPI.postCollectionCreation(value).then((status) =>
        {
            setStatus(status);
            setSavingCollection(false)
        }).catch(() => {
            setSavingCollectionError(true)
        }) 
    }
    const handleClose = () => {
        setStatus(null);
        setSavingCollectionError(false)
        setSavingCollection(false)
        handleCancel()
    }
    return(
        <>
            <h3>Create new Collection</h3>
            <div className='mb-3'>
                <label htmlFor="collectionName" className="form-label">Collection name</label>
                <input type="text" className="form-control" id="collectionName" aria-describedby="collectionNameHelp" value={value} onChange={handleChange}></input>
                {value.length < 3 && (
                    <>
                        <div id="collectionNameHelp" className="form-text">Collection name must be at least 3 character long.</div>
                    </>
                )}
                {existCollectionByThisName(value) && (
                    <>
                        <div id="collectionNameHelp" className="form-text">Collection name already have existed. Use another.</div>
                    </>
                )}
                
            </div>
            {savingCollection && (
                <>
                    <LoadingStatus error={savingCollectionError} errorText={"Something went wrong, try again"} loadingText={"Saving collection"}/>
                </>
            )}
            {status != null && (<>
                <div className="d-flex justify-content-center">
                    <h5>{status}</h5>
                </div>
            </>)}
            <div className="d-flex flex-row justify-content-around">
                {value.length >= 3 && !existCollectionByThisName(value) ? (
                    <>
                        <button type="button" className="btn btn-success" onClick={saveCollection}>Save</button>
                    </>
                ) : (
                    <>
                        <button type="button" className="btn btn-success" disabled>Save</button>
                    </>
                )}
                <button type="button" className="btn btn-danger" onClick={handleClose}>Close</button>
            </div>
        </>
    )
}

export default CollectionCreation;