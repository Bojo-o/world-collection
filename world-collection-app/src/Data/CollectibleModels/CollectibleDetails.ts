/**
 * Data model representing detail of collectible.
 * It contains data of one detail/property (Wikidata).
 * There are some attributes, which make sense only when specific detail is given.Thats are unit and timePrecision.
 * For that reason, all attributes are optional.
 */
export class CollectibleDetail {
    /** Name of detail. */
    propertyName: string = "";
    /** Data type of value, whose detail it contains. */
    dataType: string = "";
    /** List of values, which details contains.*/
    values: string[] = [];
    /** Unit in whose is value expressed. Used when dataType is "Quantity" */
    unit: string | null = null;
    /** Precision in whose is time value expressed. Used when dataType is "Time" */
    timePrecision: number | null = null;

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.property) this.propertyName = initializer.property;
        if (initializer.dataType) this.dataType = initializer.dataType;
        if (initializer.values) {
            let values: string = initializer.values;
            values.split("<space>").map((value) => {
                return this.values.push(value);
            })
        }
        if (initializer.unit) this.unit = initializer.unit;
        if (initializer.timePrecision) this.timePrecision = Number.parseInt(initializer.timePrecision);
    }
}