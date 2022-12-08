import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Collectible } from '../Data/Database/Collectible';

export interface CollectibleWayPointProps{
    collectible : Collectible
}
function CollectibleWayPoint({collectible} : CollectibleWayPointProps){
    return (
        <React.Fragment>
            <Marker position={[collectible.longitude,collectible.latitude]}>

            </Marker>
        </React.Fragment>
    )
}

export default CollectibleWayPoint;