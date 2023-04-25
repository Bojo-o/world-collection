import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import DraggableMarker from "../Map/Markers/DraggableMarker";
import MapFlyToOption from "../Map/MapOptions/MapFlyToOption";
import '../Map/Map.css';
import SearchBar from "../SearchBar/SearchBar";
import { WikiDataAPI } from "../API/WikiDataAPI";
import { SearchData } from "../Data/DataModels/SearchData";
import { RawCollectible } from "../Data/CollectibleModels/RawCollectible";
import './CollectiblesAdding.css'
import RawCollectiblesSaving from "../DataSaving/RawCollectiblesSaving";
import RawCollectibleCard from "../Map/Markers/RawCollectibleMarker/RawCollectibleCard";
import { useMediaQuery } from "react-responsive";

const center = {
    lat: 51.505,
    lng: -0.09,
}

function CollectiblesAdding(){
    const [position,setPosition] = useState<{lat : number,lng : number}>(center);
    const [collectibles,setCollectibles] = useState<RawCollectible[]>([]);
    const [collectible,setCollectible] = useState<RawCollectible|null>(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);

    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })
    const [showingAddingMenu,setShowingAddingMenu] = useState(false);

    const changePosition = (providedCollectible : RawCollectible) => {
        setPosition({lat : providedCollectible.latitude,lng : providedCollectible.longitude});
    }
    const dataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForCollectible(searchWord);
    }
    const handleClickedCollectible = (data : SearchData) => {
        fetchCollectibleData(data.QNumber);
        setPosition({lat : data.latitude,lng : data.longitude})
    }   
    const addCollectible = (collectible : RawCollectible) => {
        setCollectibles([...collectibles, collectible]);
        setCollectible(null)
    }
    const fetchCollectibleData = (QNumber : string) => {
        setLoading(true)
        setError(false)
        WikiDataAPI.getCollectibleData(QNumber).then((data) => {
            console.log(data)
            setCollectible(data)

            setLoading(false)
        }).catch(() => {
            setError(true)
        })
    }
    const handleRemove = (collectible : RawCollectible) =>{
        setCollectibles((prev) => prev.filter((c) => c.QNumber != collectible.QNumber))
    }
    const renderAddingMenu = () => {
        return (
            <>
                <div className="d-flex flex-column border border-dark border-2 rounded-end container" >
                    <div className='d-flex flex-row justify-content-between '>
                        <h1>Add collectibles</h1>
                        <button type="button" className="btn btn-outline-light btn-lg" onClick={handleAddingMenu}>
                                <img className="align " src={ require('../static/Icons/close.png') }  width="40" height="40"/>
                        </button>
                    </div>
                    
                    <h5>You can here search for collectible and add it to your collection.</h5>
                    
                    
                    <SearchBar placeHolderText={"Type some collectible, likes Eiffel tower"} handleClickedResult={handleClickedCollectible} dataGetter={dataGetter} emptySearchingFlag={false}/> 
                    <div>
                        {loading && (<>
                            {error ? (
                                <>
                                    <h4>Some error occurs, try again or later</h4>
                                </>
                            ) : (
                                <>
                                    <div className="d-flex flex-row">
                                        <h4>Getting collectible data</h4>
                                        <div className="spinner-border text-info" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>)}
                        {collectible != null && (
                            <>  
                                <div className="d-flex flex-row">
                                    <h4>Choosed"{collectible.name}"</h4>
                                    <button type="button" className="btn btn-success" onClick={() => {addCollectible(collectible)}}>Add</button>
                                </div>
                                
                                <div className="d-flex flex-wrap">
                                    {collectible.instanceOF.map((type) => {
                                        return (
                                            <>
                                                <span className="badge rounded-secondary bg-primary">{type}</span>
                                            </>
                                        )
                                    })}
                                </div>                                
                            </>
                        )}
                    </div>
                    <h2>Collectibles:</h2>
                    <ul className="list-group" id="list">
                        {collectibles.map((c) => {
                            return(
                                <>
                                    <li className="list-group-item position-static" onClick={() => changePosition(c)}>
                                        <div className="d-flex flex-row justify-content-between">
                                            <h4>{c.name}</h4>
                                            <button type="button" className="btn btn-danger" onClick={() => handleRemove(c)}>Remove</button>
                                        </div>
                                    </li>
                                </>
                            )
                        })}
                    </ul>
                    {collectibles.length != 0 && (
                        <>
                            <RawCollectiblesSaving rawCollectibles={collectibles} />
                        </>
                    )}
                </div>
            </>
        )
    }
    const handleAddingMenu = () => {
        setShowingAddingMenu((prev) => !prev);
    }
    const renderMap = () => {
        return (
            <>
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} zoomControl={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {collectible != null && (
                            <>
                                <Marker position={[collectible.latitude,collectible.longitude]}>
                                    <Popup>
                                        <RawCollectibleCard rawCollectible={collectible} />
                                    </Popup>
                                </Marker>
                                
                            </>
                        )}
                        {collectibles.map((c) => {
                            return (
                                <>
                                    <Marker position={[c.latitude,c.longitude]}>
                                        <Popup>
                                            <RawCollectibleCard rawCollectible={c} />
                                        </Popup>
                                    </Marker>
                                </>
                            )
                        })}
                        <MapFlyToOption pointOfTheEarth={position} />
                        <ZoomControl position="bottomright" zoomInText="🔍" zoomOutText="🗺️" />
                    </MapContainer>
            </>
        )
    }
    return (
        <>
            
            <div className="d-flex flex-row w-100 justify-content-center">
                {showingAddingMenu ? (
                    <>
                        {renderAddingMenu()}
                    </>
                ) : (
                    <>
                        <div className='side-menu'>
                            <button type="button" className="btn btn-outline-light btn-lg" onClick={handleAddingMenu}>
                                <img className="align " src={ require('../static/Icons/menu.png') }  width="40" height="40"/>
                            </button>
                        </div>
                    </> 
                )}
                        
                {(isBigScreen || !showingAddingMenu) && 
                    renderMap()
                }

            </div>
        </>
    )
}
export default CollectiblesAdding;