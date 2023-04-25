import { useEffect } from "react";
import { useMap } from "react-leaflet";

/** Props neccesary for Map FlyTo option. */
export interface MapFlyToOptionProps{
    /** The object representing pair of coordinates of the point, to which the view will fly. */
    pointOfTheEarth : {lat : number,lng : number}
}
/**
 * Options, which can be used in MapContainer element.
 * It takes coordinates of some waypoint and then it provides animation "flyTo" and map view goes to that waypoint.
 * @param MapFlyToOptionProps See MapFlyToOptionProps desciption.
 * @returns Nothing.
 */
function MapFlyToOption({pointOfTheEarth: point} : MapFlyToOptionProps){
    const map = useMap(); 
    
    useEffect(() => {
        map.flyTo(point);
    },[map,point])

    return (
        <></>
    );
}

export default MapFlyToOption;