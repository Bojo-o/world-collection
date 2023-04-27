import { useState } from 'react';
import { Circle, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { WikiDataAPI } from '../../../API/WikiDataAPI';
import { SearchData } from '../../../Data/DataModels/SearchData';
import SearchBar from '../../../SearchBar/SearchBar';

import "../../../Map/Map.css";
import MapFlyToOption from '../../../Map/MapOptions/MapFlyToOption';
import DraggableMarker from '../../../Map/Markers/DraggableMarker';
import { useMediaQuery } from 'react-responsive';
import MapWrapper from '../../../Map/MapWrapper';


/**
 * Props necessary for SearchByRadius component.
 */
export interface SearchByRadiusProps {
    /**
     * Func from parent component to handle going to the next step of search process.
     * @param center coordinated of center of search circle
     * @param radius number of km defining radius of search circle
     */
    handleNext: (center: { lat: number, lng: number }, radius: number) => void;
    /**
     * Func from parent component to handle going one step back.
     */
    handleBack: () => void;
}
/**
 * Func rendering UI for selecting circle area, in which collectible have to locate, for collectilbe search query.
 * UI contains side-menu bar, where the user can select radius.
 * Also it contains option to search for places, then center of circle can be moved to location of those places.
 * Func renders map, where circle is displayed to show circle area restriction to the user.
 * @param SearchByRadiusProps See SearchByRadiusProps dexcription.
 * @returns JSX element rendering UI for selection of circle area, in which collectible have to locate.
 */
function SearchByRadius({ handleNext: handleRadiusArea, handleBack }: SearchByRadiusProps) {
    /** Default center of circle */
    const center = {
        lat: 51.505,
        lng: -0.09,
    }
    const [positionOfMarker, setPositionOfMarker] = useState<{ lat: number, lng: number }>(center)
    const [radius, setRadius] = useState(1);
    const fillBlueOptions = { fillColor: 'blue' }
    const [showingRadiusMenu, setShowingRadiusMenu] = useState(false);
    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })

    /**
     * Data getter for Search bar to search for places.
     * By places we means anything, which has coordinates on the Earth
     * @param searchWord Key word used for searching.
     * @returns Found places.
     */
    const placesDataGetter = (searchWord: string) => {
        return WikiDataAPI.searchForCollectible(searchWord);
    }

    const handleClickedPlace = (data: SearchData) => {
        setPositionOfMarker({ lat: data.latitude, lng: data.longitude })
    };
    const changePosition = (newPosition: { lat: number, lng: number }) => {
        setPositionOfMarker(newPosition);
    }
    const handleRangeSlider = (event: any) => {
        const value = event.target.value;
        setRadius(value);
    }

    const renderRadiusMenu = () => {
        return (
            <div className='d-flex flex-column  border border-dark border-2 rounded-end container'>
                <div className='d-flex flex-row'>
                    <h3>Seach for some location</h3>
                    <button type="button" className="btn btn-outline-light btn-lg" onClick={handleRadiusMenu}>
                        <img className="align " src={require('../../../static/Icons/close.png')} width="40" height="40" />
                    </button>
                </div>

                <SearchBar placeHolderText={"Type some location"} handleClickedResult={handleClickedPlace} dataGetter={placesDataGetter} emptySearchingFlag={false} />

                <label htmlFor="radiusRange" className="form-label">
                    <h3>Set range radius</h3>
                    <h5>Current radius : {radius}</h5>
                </label>
                <input type="range" className="form-range" min={1} max={250} value={radius} id="radiusRange" onChange={handleRangeSlider} />
                {isBigScreen ? (
                    <>
                        <button type='button' className='btn btn-success' onClick={() => handleRadiusArea(positionOfMarker, radius)}>Save and continue</button>
                    </>
                ) : (
                    <>
                        <button type='button' className='btn btn-secondary' onClick={handleRadiusMenu}>Return to map</button>
                    </>
                )}
            </div>
        )

    }
    const handleRadiusMenu = () => {
        setShowingRadiusMenu((prev) => !prev);
    }
    return (
        <div className='d-flex flex-row w-100 justify-content-center'>
            {showingRadiusMenu ? (
                <>
                    {renderRadiusMenu()}
                </>
            ) : (
                <>
                    <div className='side-menu d-flex flex-column'>
                        <button type="button" className="btn btn-outline-light" onClick={handleBack}>
                            Back to area choosing
                        </button>
                        <button type="button" className="btn btn-outline-light" onClick={handleRadiusMenu}>
                            <img className="align " src={require('../../../static/Icons/menu.png')} width="40" height="40" />
                        </button>
                        <button type="button" className="btn btn-outline-success" onClick={() => handleRadiusArea(positionOfMarker, radius)} >
                            Save & Continue
                        </button>
                    </div>
                </>
            )}

            {(isBigScreen || !showingRadiusMenu) && (
                <MapWrapper mapContainerBody={() => {
                    return (
                        <>
                            <DraggableMarker position={positionOfMarker} handleChangeOfPosition={changePosition} />
                            <MapFlyToOption pointOfTheEarth={positionOfMarker} />
                            <Circle center={positionOfMarker} pathOptions={fillBlueOptions} radius={radius * 1000} />
                        </>
                    )
                }} />
            )}

        </div>
    );
}

export default SearchByRadius;
