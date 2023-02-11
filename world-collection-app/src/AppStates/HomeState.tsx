import React, { useState, useEffect } from 'react'
import { Collection } from '../Data/Database/Colection';
import { Collectible } from '../Data/Database/Collectible';
import { DatabaseAPI } from '../DatabaseGateway/DatabaseAPI';
import Map from '../Map/Map';
import './HomeState.css';

function HomeState() {
    const [collections,setCollections] = useState<Collection[]>([]);
    const [collectionsToShow,setCollectionsToShow] = useState<Collection[]>([]);
    const [collectionLoading,setCollectionLoading] = useState(false);

    const [collectiblesToShow,setCollectiblesToShow] = useState<Collectible[]>([]);

    const [filter,setfilter] = React.useState<string>('');

    const handleCollectionSearch = (event : any) => {
        const value = event.target.value;
        setfilter(value);  
    }

    const handleCollectionSelect = (collectionID : Number) => {
        console.log(collectionID)
        DatabaseAPI.getCollectiblesInCollection(collectionID).then((collectibles) => {
            setCollectiblesToShow(collectibles);
            console.log(collectibles)
        })
    }

    useEffect(() => {
        setCollectionLoading(true);
        DatabaseAPI.getCollections().then( (collections) => {
            setCollectionLoading(false);
            setCollections(collections);
            setCollectionsToShow(collections)
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
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" onChange={handleCollectionSearch} />

                    
                    {collectionLoading ? (
                        <p>Collections Loading</p>
                    ) : (
                        <ul id='collectionsList'>     
                            {collectionsToShow.map((collection,index) => {
                                return (
                                    <div key={index} className="d-flex flex-row">
                                        <li>
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id={"flexRadioDefault"+collection.collectionID} onChange={() => handleCollectionSelect(collection.collectionID)}/>
                                            <label className="form-check-label" htmlFor={"flexRadioDefault"+collection.collectionID}>
                                                {collection.name}
                                            </label>                                           
                                        </li>
                                    </div>
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