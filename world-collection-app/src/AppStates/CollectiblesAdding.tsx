import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import DraggableMarker from "../CollectiblesSearching/DraggableMarker";
import MapFlyToOption from "../Map/MapOptions/MapFlyToOption";
import '../Map/Map.css';
import SearchBar from "../DataSearching/SearchBar/SearchBar";
import { WikiDataAPI } from "../API/WikiDataAPI";
import { SearchData } from "../Data/SearchData/SearchData";
import { RawCollectible } from "../Data/RawCollectible";
import './CollectiblesAdding.css'
import CollectiblesSaving from "../DateSaving/CollectiblesSaving";

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

    const changePosition = (providedCollectible : RawCollectible) => {
        setPosition({lat : providedCollectible.lati,lng : providedCollectible.long});
    }
    const dataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForPlaces(searchWord);
    }
    const handleClickedCollectible = (data : SearchData) => {
        fetchCollectibleData(data.QNumber);
        setPosition({lat : Number(data.lati),lng : Number(data.long)})
    }   
    const addCollectible = (collectible : RawCollectible) => {
        setCollectibles([...collectibles, collectible]);
        setCollectible(null)
    }
    const fetchCollectibleData = (QNumber : string) => {
        setLoading(true)
        setError(false)
        WikiDataAPI.collectibleDataGetter(QNumber).then((data) => {
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
    return (
        <>
            <div className="d-flex flex-row w-100">
                <div className="d-flex flex-column w-50 border border-dark border-2 rounded-end ">
                    <h2>Add collectibles</h2>
                    <h5>You can here search for collectible and add it to your collection.</h5>
                    <h5>Also you can add custom collectible, just find it on map and name it.</h5>
                    
                    <SearchBar placeHolder={"Type some collectible, likes Eiffel tower"} handleClickedResult={handleClickedCollectible} dataGetter={dataGetter} emptySearchingFlag={false}/> 
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
                                
                                <div className="d-flex flex-row">
                                    {collectible.subTypeOf.split('/').map((type) => {
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
                            <CollectiblesSaving collectibles={collectibles} />
                        </>
                    )}
                </div>
                
                    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {collectible != null && (
                            <>
                                <Marker position={[collectible.lati,collectible.long]}>
                                    <Popup>
                                        {collectible.name}
                                    </Popup>
                                </Marker>
                                
                            </>
                        )}
                        {collectibles.map((c) => {
                            return (
                                <>
                                    <Marker position={[c.lati,c.long]}></Marker>
                                </>
                            )
                        })}
                        <MapFlyToOption position={position} />
                    </MapContainer>
                
            </div>
        </>
    )
}
export default CollectiblesAdding;