import { useEffect, useState } from "react";
import { Collection } from "../Data/Database/Colection";
import { RawCollectible } from "../Data/RawCollectible";
import { DatabaseAPI } from "../DatabaseGateway/DatabaseAPI";
import LoadingStatus from "../Gadgets/LoadingStatus";

export interface CollectiblesSavingProps{
    collectibles : RawCollectible[];
}
function CollectiblesSaving({collectibles} : CollectiblesSavingProps){
    const [collections,setCollections] = useState<Collection[]>([])
    const [loading,setLoading] = useState(false);
    const [loadingError,setLoadingError] = useState(false);
    const [selectedCollectionID,setSelectedCollectionID] = useState<number|null>(null);

    const [display,setDisplay] = useState(false);

    const fetchCollection = () =>{
        setLoading(true);
        setLoadingError(false);
        DatabaseAPI.getCollections().then((data) => {
            setLoading(false);
            setCollections(data);
        }).catch(() => {
            setLoadingError(true)
        })
    }
    const handleCollectionSelection = (e : any) => {
        console.log(e.target.value)
        let id : number = e.target.value;
        setSelectedCollectionID(id)
    }
    const handleClose = () => {
        setSelectedCollectionID(null);
        setDisplay(false);
    }
    const saveCollectibles = () => {
        if (selectedCollectionID != null){
            DatabaseAPI.postCollectibles(selectedCollectionID,collectibles).then((status) =>
                console.log(status)
            ).catch()
        }
        
    }
    useEffect(() => {
        fetchCollection()
    },[])
    return(
        <>
            {!display ? (
                <>
                    <button type="button" className="btn btn-success" onClick={() => setDisplay(true)}>Save Collectibles</button>
                </>
            ): (
                <>
                    <div className="d-flex flex-column">
                        <h3>Save collectibles into collection</h3>
                        {loading ? (
                            <>
                                <LoadingStatus error={loadingError} errorText={"Something went wrong, try again"} loadingText={"Loading collections"}/>
                            </>
                        ) : (
                            <>
                                <select className="form-select" onChange={handleCollectionSelection}>
                                    <option value="" selected disabled hidden>Choose Collection</option>
                                    {collections.map((c,index) => {
                                        return (
                                            <option key={index} value={c.collectionID}>{c.name}</option>
                                        )
                                    })}
                                </select>
                            </>
                        )}
                        <div className="d-flex flex-row justify-content-around">
                                {selectedCollectionID == null ? (
                                    <>
                                        <button type="button" className="btn btn-success" disabled>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-success" onClick={saveCollectibles}>Save</button>
                                    </>
                                )}
                            <button type="button" className="btn btn-danger" onClick={handleClose}>Close</button>
                        </div>
                        
                    </div>
                </>
            )}
            
        </>
    )
}
export default CollectiblesSaving;