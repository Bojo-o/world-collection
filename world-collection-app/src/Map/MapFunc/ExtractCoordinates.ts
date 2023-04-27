import { Coordinates } from "../../Data/MapModels/CoordinatesData";

/** Try to exctract from any list of objects their coordinates. */
export function extractFromObjectCoordinateData(data: any[]): Coordinates[] {
    let coordinates: Coordinates[] = data.map((d: any) => {
        return new Coordinates(d)
    });
    return coordinates;
}
