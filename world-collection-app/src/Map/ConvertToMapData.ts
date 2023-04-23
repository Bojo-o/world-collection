import { Coordinates } from "../Data/MapModels/CoordinatesData";

export function convertToMapDataModel(data : any[]) : Coordinates[] {
    let mapData : Coordinates[] = data.map((d : any) => {
        return new Coordinates(d)
        
    });
    return mapData;
}