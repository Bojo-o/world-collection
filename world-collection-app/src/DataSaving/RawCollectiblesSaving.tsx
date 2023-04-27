import { useEffect, useState } from "react";
import { Collection } from "../Data/DatabaseModels/Colection";
import { RawCollectible } from "../Data/CollectibleModels/RawCollectible";
import { DatabaseAPI } from "../API/DatabaseAPI";
import LoadingStatus from "../Gadgets/LoadingStatus";
import CollectionCreation from "./CollectionCreation";

/**
 * Props necessary for RawCollectiblesSaving.
 */
export interface RawCollectiblesSavingProps {
    /** Array of raw collectibles, which the user wants to save. */
    rawCollectibles: RawCollectible[];
}
/**
 * Func rendering UI for the user to save raw colletibles into databse via
 * DatabaseAPI into the specif collection, which the user chooses in selector of collections.
 * @param RawCollectiblesSavingProps See RawCollectiblesSavingProps description.
 * @returns JSX element rendering UI for saving raw collectibles.
 */
function RawCollectiblesSaving({ rawCollectibles: collectibles }: RawCollectiblesSavingProps) {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const [selectedCollectionID, setSelectedCollectionID] = useState<number | null>(null);

    const [display, setDisplay] = useState(false);
    const [collectionCreationDisplay, setCollectionCreationDisplay] = useState(false);

    const [status, setStatus] = useState<string | null>(null);
    const [savingData, setSavingData] = useState(false);
    const [savingError, setSavingError] = useState(false);

    /**
     * Fetches from DatabaseAPI all colections. It is necessary to render selector of collections, into which can be collectibles saved.
     */
    const fetchCollection = () => {
        setLoading(true);
        setLoadingError(false);
        DatabaseAPI.getAllCollections().then((data) => {
            setLoading(false);
            setCollections(data);
        }).catch(() => {
            setLoadingError(true)
        })
    }
    const handleCollectionSelection = (e: any) => {
        let id: number = e.target.value;
        setSelectedCollectionID(id)
    }
    const handleClose = () => {
        setSelectedCollectionID(null);
        setDisplay(false);
        setSavingData(false);
        setSavingError(false);
        setStatus(null);
    }
    /**
     * Calls DatabaseAPI to save all raw collectibles.
     */
    const saveCollectibles = () => {
        if (selectedCollectionID != null) {
            setSelectedCollectionID(null)
            setSavingData(true);
            setSavingError(false);
            DatabaseAPI.addCollectiblesIntoCollection(selectedCollectionID, collectibles).then((status) => {
                setStatus(status);
                setSavingData(false)
            }

            ).catch(() => {
                setSavingError(true);
            })
        }

    }
    useEffect(() => {
        fetchCollection()
    }, [])
    return (
        <>
            {!display ? (
                <>
                    <button type="button" className="btn btn-success" onClick={() => setDisplay(true)}>Save Collectibles</button>
                </>
            ) : (
                <>
                    {collectionCreationDisplay ? (
                        <>
                            <CollectionCreation collection={collections} handleCancel={() => {
                                setCollectionCreationDisplay(false)
                                fetchCollection()
                            }} />
                        </>
                    ) : (
                        <>
                            <div className="d-flex flex-column">
                                <h3>Save collectibles into collection</h3>
                                {loading ? (
                                    <>
                                        <LoadingStatus error={loadingError} errorText={"Something went wrong, try again"} loadingText={"Loading collections"} />
                                    </>
                                ) : (
                                    <>
                                        <select className="form-select" onChange={handleCollectionSelection}>
                                            <option value="" selected disabled hidden>Choose Collection</option>
                                            {collections.map((c, index) => {
                                                return (
                                                    <option key={index} value={c.collectionID}>{c.name}</option>
                                                )
                                            })}
                                        </select>
                                    </>
                                )}
                                {savingData && (
                                    <>
                                        <LoadingStatus error={savingError} errorText={"Something went wrong, try again"} loadingText={"Saving collectibles"} />
                                    </>
                                )}
                                {status != null && (
                                    <div className="d-flex justify-content-center">
                                        <h5>{status}</h5>
                                    </div>
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
                                    {!loading && (
                                        <>
                                            <button type="button" className="btn btn-info" onClick={() => setCollectionCreationDisplay(true)}>Create new Collection</button>
                                        </>
                                    )}

                                    <button type="button" className="btn btn-danger" onClick={handleClose}>Close</button>
                                </div>

                            </div>
                        </>
                    )}

                </>
            )}

        </>
    )
}
export default RawCollectiblesSaving;