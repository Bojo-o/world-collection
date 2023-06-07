import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import MapFlyToOption from "../Map/MapOptions/MapFlyToOption";
import '../Map/Map.css';
import SearchBar from "../SearchBar/SearchBar";
import { WikiDataAPIProxy } from "../API/WikiDataAPIProxy";
import { SearchData } from "../Data/DataModels/SearchData";
import { RawCollectible } from "../Data/CollectibleModels/RawCollectible";
import './CollectiblesAdding.css'
import RawCollectiblesSaving from "../DataSaving/RawCollectiblesSaving";
import RawCollectibleCard from "../Map/Markers/RawCollectibleMarker/RawCollectibleCard";
import { useMediaQuery } from "react-responsive";
import MapWrapper from "../Map/MapWrapper";

/**
 * Func rendering UI, where the user can search for colectible by Search bar, which search for collectibles by name.
 * Found collectible can be added into list (list containing raw collectibles, which the user want to collect), which can be then saved into some collection.
 * @returns JSX element rendering UI for searching and saving collectible.
 */
function CollectiblesAdding() {
    const center = {
        lat: 51.505,
        lng: -0.09,
    }
    const [position, setPosition] = useState<{ lat: number, lng: number }>(center);
    const [collectibles, setCollectibles] = useState<RawCollectible[]>([]);
    const [collectible, setCollectible] = useState<RawCollectible | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })
    const [showingAddingMenu, setShowingAddingMenu] = useState(false);

    const changePosition = (providedCollectible: RawCollectible) => {
        setPosition({ lat: providedCollectible.latitude, lng: providedCollectible.longitude });
    }
    /**
     * Data getter for Search bar to search for collectibles by name.
     * @param searchWord Key word used for searching.
     * @returns Found collectibles.
     */
    const dataGetter = (searchWord: string) => {
        return WikiDataAPIProxy.searchForCollectible(searchWord);
    }
    const handleClickedCollectible = (data: SearchData) => {
        fetchCollectibleData(data.QNumber);
        setPosition({ lat: data.latitude, lng: data.longitude })
    }
    const addCollectible = (collectible: RawCollectible) => {
        setCollectibles([...collectibles, collectible]);
        setCollectible(null)
    }
    /**
    * Fetches data about collectible by QNUmber.
    * @param QNumber QNumber of collectible.
    */
    const fetchCollectibleData = (QNumber: string) => {
        setLoading(true)
        setError(false)
        WikiDataAPIProxy.getCollectibleData(QNumber).then((data) => {
            setCollectible(data)
            setLoading(false)
        }).catch(() => {
            setError(true)
        })
    }
    const handleRemove = (collectible: RawCollectible) => {
        setCollectibles((prev) => prev.filter((c) => c.QNumber !== collectible.QNumber))
    }
    /**
     * Renders side menu containg Search bar for searhing specific collectibles.
     * It manages adding to and removing from list of raw collectibles, which the user want to collect.
     * 
     * @returns JSX element
     */
    const renderAddingMenu = () => {
        return (
            <div data-testid="adding menu" className="d-flex flex-column border border-dark border-2 rounded-end container" >
                <div className='d-flex flex-row justify-content-between '>
                    <h1>Add collectibles</h1>
                    <button data-testid="close adding menu" type="button" className="btn btn-outline-light btn-lg" onClick={handleAddingMenu}>
                        <img className="align " src={require('../static/Icons/close.png')} width="40" height="40" alt="close icon" />
                    </button>
                </div>

                <h5>You can here search for collectible and add it to your collection.</h5>


                <SearchBar placeHolderText={"Type some collectible, likes Eiffel tower"} handleClickedResult={handleClickedCollectible} dataGetter={dataGetter} emptySearchingFlag={false} />
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
                                <button type="button" className="btn btn-success" onClick={() => { addCollectible(collectible) }}>Add</button>
                            </div>

                            <div className="d-flex flex-wrap">
                                {collectible.instanceOF.map((type, index) => {
                                    return (
                                        <span key={index} className="badge rounded-secondary bg-primary">{type}</span>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
                <h2>Collectibles:</h2>
                <ul className="list-group" id="list">
                    {collectibles.map((c, index) => {
                        return (
                            <li key={index} className="list-group-item position-static" onClick={() => changePosition(c)}>
                                <div key={index} className="d-flex flex-row justify-content-between">
                                    <h4>{c.name}</h4>
                                    <button type="button" className="btn btn-danger" onClick={() => handleRemove(c)}>Remove</button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                {collectibles.length !== 0 && (
                    <>
                        <RawCollectiblesSaving rawCollectibles={collectibles} />
                    </>
                )}
            </div>
        )
    }
    const handleAddingMenu = () => {
        setShowingAddingMenu((prev) => !prev);
    }
    /**
     * Renders map with raw collectibles, which are in the list of raw collectibles and the current found and select collectible.
     * @returns JSX element
     */
    const renderMap = () => {
        return (
            <>
                <MapWrapper mapContainerBody={() => {
                    return (
                        <>
                            {collectible != null && (
                                <Marker position={[collectible.latitude, collectible.longitude]}>
                                    <Popup>
                                        <RawCollectibleCard rawCollectible={collectible} />
                                    </Popup>
                                </Marker>
                            )}
                            {collectibles.map((c, index) => {
                                return (
                                    <Marker key={index} position={[c.latitude, c.longitude]}>
                                        <Popup>
                                            <RawCollectibleCard rawCollectible={c} />
                                        </Popup>
                                    </Marker>
                                )
                            })}
                            <MapFlyToOption pointOfTheEarth={position} />
                        </>
                    )
                }} />
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
                            <button data-testid="open adding menu" type="button" className="btn btn-outline-light btn-lg" onClick={handleAddingMenu}>
                                <img className="align " src={require('../static/Icons/menu.png')} width="40" height="40" alt="menu icon" />
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