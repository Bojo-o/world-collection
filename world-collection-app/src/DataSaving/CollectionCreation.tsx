import { useState } from "react";
import { Collection } from "../Data/DatabaseModels/Colection";
import { LocalAPIProxy } from "../API/LocalAPIProxy";
import LoadingStatus from "../Gadgets/LoadingStatus";

/**
 * Props necessary for CollectionCreation.
 */
export interface CollectionCreationProps {
    /** Array of all collection, which exist in database, it is necessary have this data for checking id a name of new collection is unique and is still not used.*/
    collection: Collection[];
    /** Func for notify parent component to handle cancel of creation of collection. */
    handleCancel: () => void;
}
/**
 * Func rendering UI for creating and saving a new collection.
 * @param CollectionCreationProps See CollectionCreationProps description.
 * @returns JSX element rendering UI for creating a new collection.
 */
function CollectionCreation({ collection, handleCancel }: CollectionCreationProps) {
    const [value, setValue] = useState<string>('')
    const [savingCollection, setSavingCollection] = useState(false);
    const [savingCollectionError, setSavingCollectionError] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleChange = (event: any) => {
        const value = event.target.value;
        setValue(value);
    }
    const existCollectionByThisName = (name: string) => {
        let result = false;
        collection.forEach((c) => {
            if (c.name === name) {
                result = true;
            }
        })
        return result;
    }
    const saveCollection = () => {
        setSavingCollectionError(false)
        setSavingCollection(true)
        LocalAPIProxy.postCollectionCreation(value).then((status) => {
            setStatus(status);
            setSavingCollection(false)
            handleCancel()
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
    return (
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
                    <LoadingStatus error={savingCollectionError} errorText={"Something went wrong, try again"} loadingText={"Saving collection"} />
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