import L, { Point } from "leaflet";

export function GetIcon(){
    return L.icon({
        iconUrl : require('../static/Icons/unvisit.png'),
        iconSize : [30,40],
    })
}