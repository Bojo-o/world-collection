import { latLngBounds, LatLngBoundsExpression } from 'leaflet';
import React from 'react'
import { useMap } from 'react-leaflet';
import { ResultData } from '../Data/ResultsData';

export interface MapOptionsProps {
    waypoints : ResultData[]
}
function MapOptions({waypoints}: MapOptionsProps) {
    const map = useMap(); 
    const bounds = React.useMemo(() => {
        const b = latLngBounds([])
        waypoints.forEach((waypoint) => {
            b.extend([waypoint.long,waypoint.lati])
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