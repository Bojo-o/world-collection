import React, { useState, useEffect } from 'react'
import { Collection } from '../Data/DatabaseModels/Colection';
import { Collectible } from '../Data/DatabaseModels/Collectible';
import { DatabaseAPI } from '../API/DatabaseAPI';
import MapShowingCollectibles from '../Map/MapShowingCollectibles';
import './CollectionsOverview.css';
import { useMediaQuery } from 'react-responsive';

/**
 * Func rendering UI, where the user can see his collections, see on tha map collection`s collectibles as markers, which are clickable.
 * When the user click on them, it displayes collectibles card, where the user can makes visitaion, notes and icon editation.
 * That card also contains option to see collectible`s image anddetails.
 * @returns JSX element rendering UI for watching the uses`s collections with collectibles into them.
 */
function CollectionsOverview() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [collectionsToShow, setCollectionsToShow] = useState<Collection[]>([]);
    const [collectionLoading, setCollectionLoading] = useState(false);

    const [collectiblesToShow, setCollectiblesToShow] = useState<Collectible[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)

    const [filter, setfilter] = React.useState<string>('');

    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })
    const [showingCollectionsMenu, setShowingCollectionsMenu] = useState(false);

    const handleCollectionSearch = (event: any) => {
        const value = event.target.value;
        setfilter(value);
    }

    const handleCollectionSelect = (collectionID: Number) => {
        DatabaseAPI.getCollectiblesInCollection(collectionID).then((collectibles) => {
            console.log(collectibles)
            setCollectiblesToShow(collectibles);
        })
    }
    /**
     * Helping func for creating status from collections.
     * Status format : number of visited collectibles in collection / all collectibles in collection
     * @param collection Collection
     * @returns String representing status.
     */
    const convertStatus = (collection: Collection) => {
        let sum = +collection.visitedCollectibles + +collection.notVisitedCollectibles
        return collection.visitedCollectibles.toString() + '/' + sum.toString()
    }
    /**
     * Helping func for computing from collection in % how many collectibles have already been visited by user.
     * @param collection Collection
     * @returns Number representing %.
     */
    const computeProgress = (collection: Collection) => {
        let sum = +collection.visitedCollectibles + +collection.notVisitedCollectibles
        return (collection.visitedCollectibles / sum) * 100;
    }
    const handleClickOnCollection = (clickedCollection: Collection) => {
        setSelectedCollection(clickedCollection)
        handleCollectionSelect(clickedCollection.collectionID)
        if (!isBigScreen) {
            handleCollectibleMenu()
        }
    }
    useEffect(() => {
        setCollectionLoading(true);
        DatabaseAPI.getAllCollections().then((collections) => {
            setCollectionLoading(false);
            setCollections(collections);
            setCollectionsToShow(collections)

        }
        );
    }, [])

    useEffect(() => {
        setCollectionsToShow(collections);
        if (filter !== '') {
            setCollectionsToShow((prev) => prev.filter((result) => result.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())));
        }
    }, [filter,collections])
    const handleCollectibleMenu = () => {
        setShowingCollectionsMenu((prev) => !prev);
    }
    const renderCollectionsMenu = () => {
        return (
            <>

                <div data-testid="collectionsMenu" className=' d-flex flex-column border border-dark border-2 rounded-end container' >
                    <div className='d-flex flex-row justify-content-between '>
                        <h1>Your Colections</h1>
                        <button data-testid="close collectionsMenu" type="button" className="btn btn-outline-light btn-lg" onClick={handleCollectibleMenu} >
                            <img className="align " src={require('../static/Icons/close.png')} width="40" height="40" alt='close icon'/>
                        </button>
                    </div>

                    <input className="form-control mr-sm-2" type="search" placeholder="Search for collection" onChange={handleCollectionSearch} />


                    {collectionLoading ? (
                        <p>Collections Loading</p>
                    ) : (
                        <ul className='list-group' id='collectionsList'>
                            {collectionsToShow.map((collection, index) => {
                                let className = "list-group-item list-group-item-action ";
                                if (selectedCollection != null && collection.collectionID === selectedCollection.collectionID) {
                                    className = className + "active"
                                }
                                let style = {
                                    width: computeProgress(collection).toString() + "%"
                                };

                                return (
                                    <li key={index} className={className} onClick={() => handleClickOnCollection(collection)}>
                                        <div className='d-flex flex-column'>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h4 className="mb-1">{collection.name}</h4>
                                                <span className="badge bg-info rounded-pill">{convertStatus(collection)}</span>
                                            </div>
                                            <div className="progress">
                                                <div className="progress-bar bg-success" style={style} role="progressbar" aria-valuenow={collection.visitedCollectibles} aria-valuemin={0} aria-valuemax={collection.notVisitedCollectibles + collection.visitedCollectibles}></div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </>
        )
    }
    return (
        <>
            <div className='d-flex flex-row w-100 justify-content-center '>
                {showingCollectionsMenu ? (
                    <>
                        {renderCollectionsMenu()}
                    </>
                ) : (
                    <>
                        <div className='side-menu'>
                            <button data-testid="buttonToOpenCollectionList" type="button" className="btn btn-outline-light" onClick={handleCollectibleMenu}>
                                <img className="align " src={require('../static/Icons/menu.png')} width="40" height="40" alt='menu icon'/>
                            </button>
                        </div>
                    </>
                )}

                {(isBigScreen || !showingCollectionsMenu) && (
                    <MapShowingCollectibles collectiblesToShow={collectiblesToShow} />
                )}
            </div>

        </>
    );
}

export default CollectionsOverview;