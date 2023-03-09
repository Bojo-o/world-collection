import { latLngBounds, LatLngBoundsExpression } from 'leaflet';
import React from 'react'
import { useMap } from 'react-leaflet';
import { MapData } from '../../Data/MapData/MapData';

export interface MapOptionsProps {
    waypoints : MapData[]
}
function MapOptions({waypoints}: MapOptionsProps) {
    const map = useMap(); 
    
    const bounds = React.useMemo(() => {
        const b = latLngBounds([])
        waypoints.forEach((waypoint) => {
            b.extend([waypoint.latitude,waypoint.longitude])
        })
        return b
    }, [waypoints])

    React.useEffect(() => {
        if (waypoints.length === 0){
            return;
        }
        map.fitBounds(bounds)
    },[map,waypoints])

    return (
        <></>
    );
}

export default MapOptions;