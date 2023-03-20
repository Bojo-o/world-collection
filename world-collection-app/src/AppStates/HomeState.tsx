import React, { useState, useEffect } from 'react'
import { Collection } from '../Data/Database/Colection';
import { Collectible } from '../Data/Database/Collectible';
import { DatabaseAPI } from '../DatabaseGateway/DatabaseAPI';
import IconsSelector from '../ImageIcons/IconsSelector';
import Map from '../Map/Map';
import './HomeState.css';

function HomeState() {
    const [collections,setCollections] = useState<Collection[]>([]);
    const [collectionsToShow,setCollectionsToShow] = useState<Collection[]>([]);
    const [collectionLoading,setCollectionLoading] = useState(false);

    const [collectiblesToShow,setCollectiblesToShow] = useState<Collectible[]>([]);
    const [selectedCollection,setSelectedCollection] = useState<Collection>(new Collection())

    const [filter,setfilter] = React.useState<string>('');

    const handleCollectionSearch = (event : any) => {
        const value = event.target.value;
        setfilter(value);  
    }

    const handleCollectionSelect = (collectionID : Number) => {
        DatabaseAPI.getCollectiblesInCollection(collectionID).then((collectibles) => {
            setCollectiblesToShow(collectibles);
            console.log(collectibles)
        })
    }
    
    const convertStatus = (collection : Collection) => {
        let sum = +collection.visited + +collection.notVisited
        return   collection.visited.toString()+'/'+sum.toString()
    }
    const computeProgress = (collection : Collection) => {
        let sum = +collection.visited + +collection.notVisited
        return (collection.visited/sum)*100;
    }
    const handleClickOnCollection = (clickedCollection : Collection) => {
        setSelectedCollection(clickedCollection)
        handleCollectionSelect(clickedCollection.collectionID)
    }
    useEffect(() => {
        setCollectionLoading(true);
        DatabaseAPI.getCollections().then( (collections) => {
            setCollectionLoading(false);
            setCollections(collections);
            setCollectionsToShow(collections)
            console.log(collections)
        }        
        );
    },[])

    useEffect(() =>{
        setCollectionsToShow(collections);
        if (filter !== ''){
            setCollectionsToShow((prev) => prev.filter((result) => result.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())));
        }
    },[filter])

    return(
        <React.Fragment>
            <div className='d-flex w-100'> 
                <div className='d-flex flex-column w-25 border border-dark border-2 rounded-end'>
                    <h1>Colections</h1>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search for collection" onChange={handleCollectionSearch} />

                    
                    {collectionLoading ? (
                        <p>Collections Loading</p>
                    ) : (
                        <ul className='list-group' id='collectionsList'>     
                            {collectionsToShow.map((collection,index) => {
                                let className = "list-group-item list-group-item-action ";
                                if (collection.collectionID == selectedCollection.collectionID){
                                    className = className + "active"
                                }
                                let style = {
                                    width :  computeProgress(collection).toString()+"%"
                                };
                                return (
                                    <>
                                        <li key={index} className={className} onClick={() => handleClickOnCollection(collection)}>
                                            <div className='d-flex flex-column'>
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h4 className="mb-1">{collection.name}</h4>
                                                    <span className="badge bg-info rounded-pill">{convertStatus(collection)}</span>
                                                </div>
                                                <div className="progress">
                                                    <div className="progress-bar bg-success"  style={style} role="progressbar" aria-valuenow={collection.visited} aria-valuemin={0} aria-valuemax={collection.notVisited + collection.visited}></div>
                                                </div>
                                            </div>                                
                                        </li>
                                    </>
                                    
                                );
                            })}
                        </ul>
                    )}
                </div>           
                <Map collectiblesToShow={collectiblesToShow}/>
            </div>

        </React.Fragment>  
    );
}

export default HomeState;