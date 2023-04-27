export interface ICoordinates {
    latitude: number;
    longitude: number
}
/** Data model representing coordinates. */
export class Coordinates {
    latitude: number = 0;
    longitude: number = 0;

    constructor({ longitude, latitude }: ICoordinates) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
