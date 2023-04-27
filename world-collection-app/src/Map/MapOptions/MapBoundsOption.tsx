import { latLngBounds } from 'leaflet';
import React from 'react'
import { useMap } from 'react-leaflet';
import { Coordinates } from '../../Data/MapModels/CoordinatesData';

/** Props neccesary for Map Bounds option. */
export interface MapOptionProps {
    /** Array of coordinates, which map takes and then sets zoom and view to see all waypoint on the map.*/
    waypoints: Coordinates[]
}
/**
 * Options, which can be used in MapContainer element.
 * It takes array of waypoints and when is MapContainer rendered it sets map properties to fit all waypoints into map bounds.
 * @param MapOptionProps See MapOptionProps desciption.
 * @returns Nothing.
 */
function MapBoundsOption({ waypoints }: MapOptionProps) {
    const map = useMap();

    const bounds = React.useMemo(() => {
        const b = latLngBounds([])
        waypoints.forEach((waypoint) => {
            b.extend([waypoint.latitude, waypoint.longitude])
        })
        return b
    }, [waypoints])

    React.useEffect(() => {
        if (waypoints.length === 0) {
            return;
        }
        map.fitBounds(bounds)
    }, [map, waypoints])

    return (
        <></>
    );
}

export default MapBoundsOption;