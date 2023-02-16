import { MapData } from "../Data/MapData/MapData";

export function convertToMapDataModel(data : any[]) : MapData[] {
    let mapData : MapData[] = data.map((d : any) => new MapData(d));
    return mapData;
}