/**
 * Data model representing searching data.
 * It is used by Search bar, where user could search for some data such as collectibles,
 * places (as radius circle center) or collectibles super classes/types.
 * All attributes are optional, because places and collectibles also need to contains latitude and longitute, while classes not.
 */
export class SearchData {
    QNumber: string = '';
    name: string = '';
    description: string = '';
    latitude: number = 0;
    longitude: number = 0;

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.QNumber) this.QNumber = initializer.QNumber;
        if (initializer.name) this.name = initializer.name;
        if (initializer.description) this.description = initializer.description;
        if (initializer.lati) this.latitude = initializer.lati;
        if (initializer.long) this.longitude = initializer.long;
    }
}