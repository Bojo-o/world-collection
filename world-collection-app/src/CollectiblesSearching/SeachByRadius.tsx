import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Circle, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { WikiDataAPI } from '../API/WikiDataAPI';
import { SearchData } from '../Data/SearchData/SearchData';
import SearchBar from '../DataSearching/SearchBar/SearchBar';

import "../Map/Map.css";
import MapFlyToOption from '../Map/MapOptions/MapFlyToOption';
import DraggableMarker from './DraggableMarker';


const center = {
    lat: 51.505,
    lng: -0.09,
}
function SearchByRadius(){
    const [positionOfMarker,setPositionOfMarker] = useState<{lat : number,lng : number}>(center)
    const [radius,setRadius] = useState(1);
    const fillBlueOptions = { fillColor: 'blue' }

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
    return (
        <div className='d-flex flex-row w-100'>
            <div className='d-flex flex-column w-25 border border-dark border-2 rounded-end'>
                <h3>Seach for some location</h3>
                <SearchBar placeHolder={"Type some location"} handleClickedResult={handleClickedPlace} dataGetter={placesDataGetter} emptySearchingFlag={false}/> 

                <label htmlFor="radiusRange" className="form-label">
                    <h3>Set range radius</h3>
                    <h5>Current radius : {radius}</h5>
                </label>
                <input type="range" className="form-range" min={1} max ={250} value={radius} id="radiusRange" onChange={handleRangeSlider}/>
            </div>
            
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker position={positionOfMarker} handleChangeOfPosition={changePosition}/>
                <MapFlyToOption position={positionOfMarker} />
                <Circle center={positionOfMarker} pathOptions={fillBlueOptions} radius={ radius * 1000} />
            </MapContainer>
        </div>
    );
}

export default SearchByRadius;
