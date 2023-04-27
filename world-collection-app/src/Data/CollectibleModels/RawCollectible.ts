export interface IRawCollectible {
    QNumber: string,
    name: string,
    lati: number,
    long: number,
    subTypeOf: string
}
/**
 * Data model representing "raw" collectible.
 * By "raw" it means that collectible is not stored in user Database, user has not yet collected it.
 * So it not contains data about date of visit, notes etc.. as Collectible, which user has already collected.
 */
export class RawCollectible {
    /**Unique QNUmber of collectible. */
    QNumber: string;
    /**Name of collectible */
    name: string;
    /**Latitude of collectible. */
    latitude: number;
    /**Longitude of collectible. */
    longitude: number;
    /** List of class/types. Collectible is instance of them. */
    instanceOF: string[];

    constructor({ QNumber, name, lati, long, subTypeOf }: IRawCollectible) {
        this.QNumber = QNumber;
        this.name = name;
        this.latitude = lati;
        this.longitude = long;
        this.instanceOF = subTypeOf.split("/");
    }

    getObject = () => {
        return {
            QNumber: this.QNumber,
            name: this.name,
            lati: this.latitude,
            long: this.longitude,
            subTypeOf: this.instanceOF.join("/")
        }
    }
}