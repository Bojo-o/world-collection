import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
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


    const placesDataGetter = (searchWord : string) => {
        return WikiDataAPI.searchForPlaces(searchWord);
    }

    const handleClickedPlace = (data : SearchData) => {
        setPositionOfMarker({lat :  +data.lati,lng : +data.long})
    };
    const changePosition = (newPosition : {lat : number,lng : number}) => {
        setPositionOfMarker(newPosition);
    }
    return (
        <>
            <h3>Seach for some location</h3>
            <h2>{positionOfMarker.lat}</h2>
            <h2>{positionOfMarker.lng}</h2>

            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker position={positionOfMarker} handleChangeOfPosition={changePosition}/>
                <MapFlyToOption position={positionOfMarker} />
            </MapContainer>
            <SearchBar placeHolder={"Type some location"} handleClickedResult={handleClickedPlace} dataGetter={placesDataGetter}/>  
        </>
    );
}

export default SearchByRadius;
