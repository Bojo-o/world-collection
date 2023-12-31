import { useCallback, useEffect, useState } from "react";
import { Collection } from "../Data/DatabaseModels/Colection";
import { Collectible } from "../Data/DatabaseModels/Collectible";
import { LocalAPIProxy } from "../API/LocalAPIProxy";
import CollectiblesEditingTable from "../Tables/EditationTable/CollectiblesEditingTable";
import CollectionsEditingTable from "../Tables/EditationTable/CollectionsEditingTable";

/**
 * Func rendering UI, where the user can make editation of his collection and collectibles.
 * Collections and collectibles are displayed in editation tables.
 * It contains implementation of all func, which manage and handle editation action such as change of name, removing, merging.
 * @returns JSX element rendering UI for editing the user`s collections and collectibles.
 */
function Editation() {
    const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [edited, setEdited] = useState<Collection | null>(null);

    const [merging, setMerging] = useState<Collection | null>(null);
    const [filter, setfilter] = useState<string>('');

    const [canSaveCollection, setCanSaveCollection] = useState(false);

    const [showingCollectionCollectibles, setShowingCollectionCollectibles] = useState<null | Collection>(null);
    const [collectibles, setCollectibles] = useState<Collectible[]>([])
    const [collectiblesLoading, setCollectiblesLoading] = useState<boolean>(false);


    const [editedCollectible, setEditedCollectible] = useState<Collectible | null>(null)
    const [canSaveCollectible, setCanSaveCollectible] = useState(false);

    const handleSearch = (event: any) => {
        const value = event.target.value;
        setfilter(value);
    }
    /**
     * Fetches the user`s collectibles from database via DatabaseAPI.
     */
    const fetchCollectibles = useCallback(() => {
        if (showingCollectionCollectibles !== null) {
            setCollectiblesLoading(true);
            LocalAPIProxy.getCollectiblesInCollection(showingCollectionCollectibles.collectionID).then((collectibles) => {
                setCollectiblesLoading(false);
                setCollectibles(collectibles)

            })
        }
    }, [showingCollectionCollectibles])

    /**
     * Fetches the user`s collections from database via DatabaseAPI.
     */
    const fetchCollections = () => {
        setCollectionsLoading(true);
        LocalAPIProxy.getAllCollections().then((collections) => {
            setCollectionsLoading(false);
            setCollections(collections);
        }
        );
    }
    useEffect(() => {
        fetchCollections()
    }, [])
    useEffect(() => {
        fetchCollectibles()
        setfilter('')
    }, [showingCollectionCollectibles, fetchCollectibles])


    const mergeItem = (row: Collection) => {
        setMerging(new Collection(row.getObject()));
        setEdited(null);
    }
    const editItem = (row: Collection) => {
        setEdited(new Collection(row.getObject()));
        setMerging(null);
    }
    const cancel = () => {
        setEdited(null)
        setMerging(null)
    }
    const handleChange = (event: any) => {
        const value: string = event.target.value;

        const change = {
            name: value,
        };
        setEdited((prev) => {
            if (prev != null) {
                let temp = new Collection(prev.getObject());
                temp.name = change.name;
                return temp;
            }
            return null;
        });

        LocalAPIProxy.existsCollectionWithName(value).then((r) => {
            if (value.length > 2) {
                setCanSaveCollection(!r)
            } else {
                setCanSaveCollection(false)
            }
        })

    }
    const saveItem = (edited: Collection) => {
        LocalAPIProxy.postCollectionUpdateRename(edited.collectionID, edited.name).then(() => {
            cancel();
            fetchCollections();
        }
        )
    }
    const removeItem = (row: Collection) => {
        LocalAPIProxy.postCollectionUpdateDelete(row.collectionID).then(() => fetchCollections());
    }
    const merge = (collectionID: Number, intoCollectionID: Number) => {
        LocalAPIProxy.postCollectionUpdateMerge(collectionID, intoCollectionID).then(() => fetchCollections())
    }
    const swicthToCollectiblesEditation = (row: Collection) => {
        setShowingCollectionCollectibles(row);
        fetchCollectibles();
    }

    const returnBackToCollectionsView = () => {
        setShowingCollectionCollectibles(null)
    }

    const removeCollectible = (collectible: Collectible) => {
        if (showingCollectionCollectibles !== null) {
            LocalAPIProxy.postCollectibleDeletion(collectible.QNumber, showingCollectionCollectibles?.collectionID);
            setCollectibles((prev) => prev.filter((c) => {
                if (c.QNumber === collectible.QNumber) {
                    return false;
                }
                return true;
            }))
        }
    }

    const editCollectible = (collectible: Collectible) => {
        setEditedCollectible(collectible);
        setCanSaveCollectible(false);
    }
    const saveCollectible = (collectible: Collectible) => {
        LocalAPIProxy.postCollectibleUpdateName(collectible.QNumber, collectible.name);
        cancleCollectibleAction();
        setCollectibles((prev) => prev.map((c) => {
            if (c.QNumber === collectible.QNumber) {
                return collectible;
            }
            return c;
        }))
    }
    const cancleCollectibleAction = () => {
        setEditedCollectible(null);
        setCanSaveCollection(false);
    }

    const handleCollectibleNameChange = (event: any) => {
        const value: string = event.target.value;

        const change = {
            name: value,
        };
        setEditedCollectible((prev) => {
            if (prev != null) {
                let temp = new Collectible(prev.getObject());
                temp.name = change.name;
                return temp;
            }
            return null;
        });

        if (value.length > 2) {
            setCanSaveCollectible(true)
        } else {
            setCanSaveCollectible(false)
        }
    }
    return (
        <div data-testid="editation container">

            <h2>Edit your collections and collectibles</h2>

            {showingCollectionCollectibles === null ? (
                <>
                    {collectionsLoading ? (
                        <h3>Loading..</h3>
                    ) : (
                        <>
                            <input className="form-control mr-sm-2" type="search" placeholder="Search for collection" onChange={handleSearch} />
                            <h3>Collections:</h3>
                            <CollectionsEditingTable records={collections.filter((result) => result.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))} edited={edited}
                                editItem={editItem} cancelEditation={cancel} removeItem={removeItem} handleChange={handleChange} saveItem={saveItem} canSaveItem={canSaveCollection}
                                merge={merge} mergeItem={mergeItem} merging={merging} editCollectibles={swicthToCollectiblesEditation} />
                        </>
                    )}
                </>
            ) : (
                <>
                    {collectiblesLoading ? (
                        <h3>Loading..</h3>
                    ) : (
                        <>
                            <div className="d-flex">
                                <button type="button" className="btn btn-secondary" onClick={returnBackToCollectionsView}>Back to Collections</button>
                                <h3>Collectibles of {showingCollectionCollectibles.name}:</h3>
                            </div>
                            <input className="form-control mr-sm-2" type="search" placeholder="Search for collectible" onChange={handleSearch} />
                            <CollectiblesEditingTable records={collectibles.filter((result) => result.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))}
                                removeCollectible={removeCollectible} editedCollectible={editedCollectible} editCollectible={editCollectible} saveCollectible={saveCollectible} cancleCollectibleAction={cancleCollectibleAction}
                                handleCollectibleNameChange={handleCollectibleNameChange} canSaveCollectible={canSaveCollectible} />
                        </>
                    )}
                </>
            )}

        </div>
    )
}
export default Editation;