import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Collectible } from '../Data/Database/Collectible';
import CollectibleWayPoint from './CollectibleWayPoint';
import './Map.css';

export interface MapProps{
    collectiblesToShow : Collectible[]
}
function Map ({collectiblesToShow} : MapProps){
    return (
        <React.Fragment>
            <MapContainer 
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    collectiblesToShow.map((collectible,index) => {
                        return (<CollectibleWayPoint key={index} collectible={collectible}/>)
                    })
                }
            </MapContainer>
        </React.Fragment>
    );
}

export default Map;