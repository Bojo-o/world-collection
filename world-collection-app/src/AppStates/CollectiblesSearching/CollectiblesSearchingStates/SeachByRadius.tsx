import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Circle, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { WikiDataAPI } from '../../../API/WikiDataAPI';
import { SearchData } from '../../../Data/SearchData/SearchData';
import SearchBar from '../../../DataSearching/SearchBar/SearchBar';

import "../../../Map/Map.css";
import MapFlyToOption from '../../../Map/MapOptions/MapFlyToOption';
import DraggableMarker from '../../../CollectiblesSearching/DraggableMarker';
import { CollectiblesSearchingStates } from './CollectiblesSearchingStates';
import { useMediaQuery } from 'react-responsive';


const center = {
    lat: 51.505,
    lng: -0.09,
}
export interface SearchByRadiusProps{
    handleNext : (center : {lat : number,lng : number} , radius : number) => void;
    handleBack : () => void;
}
function SearchByRadius({handleNext: handleRadiusArea,handleBack} : SearchByRadiusProps){
    const [positionOfMarker,setPositionOfMarker] = useState<{lat : number,lng : number}>(center)
    const [radius,setRadius] = useState(1);
    const fillBlueOptions = { fillColor: 'blue' }
    const [showingRadiusMenu,setShowingRadiusMenu] = useState(false);
    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })

    const placesDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForPlaces(searchWord);
    }

    const handleClickedPlace = (data : SearchData) => {
        setPositionOfMarker({lat :  +data.lati,lng : +data.long})
    };
    const changePosition = (newPosition : {lat : number,lng : number}) => {
        setPositionOfMarker(newPosition);
    }
    const handleRangeSlider =(event : any) => {
        const value = event.target.value;
        setRadius(value);
    }
    const renderRadiusMenu = () => {
        return(
            <div className='d-flex flex-column  border border-dark border-2 rounded-end container'>
                <div className='d-flex flex-row'>
                    <h3>Seach for some location</h3>
                    <button type="button" className="btn btn-outline-light btn-lg" onClick={handleRadiusMenu}>
                        <img className="align " src={ require('../../../static/Icons/close.png') }  width="40" height="40"/>
                    </button>
                </div>
                
                <SearchBar placeHolder={"Type some location"} handleClickedResult={handleClickedPlace} dataGetter={placesDataGetter} emptySearchingFlag={false}/> 

                <label htmlFor="radiusRange" className="form-label">
                    <h3>Set range radius</h3>
                    <h5>Current radius : {radius}</h5>
                </label>
                <input type="range" className="form-range" min={1} max ={250} value={radius} id="radiusRange" onChange={handleRangeSlider}/>
                {isBigScreen ? (
                    <>
                        <button type='button' className='btn btn-success' onClick={() => handleRadiusArea(positionOfMarker,radius)}>Save and continue</button>
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
                                <img className="align " src={ require('../../../static/Icons/menu.png') }  width="40" height="40"/>
                            </button>
                            <button type="button" className="btn btn-outline-success" onClick={() => handleRadiusArea(positionOfMarker,radius)} >
                                Save & Continue
                            </button>
                        </div>
                    </> 
                )}
            
            {(isBigScreen || !showingRadiusMenu) && (
                    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker position={positionOfMarker} handleChangeOfPosition={changePosition}/>
                    <MapFlyToOption position={positionOfMarker} />
                    <Circle center={positionOfMarker} pathOptions={fillBlueOptions} radius={ radius * 1000} />
                </MapContainer>
                )}
            
        </div>
    );
}

export default SearchByRadius;
