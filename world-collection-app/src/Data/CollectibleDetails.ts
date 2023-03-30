export class CollectibleDetail{
    property : string = "";
    dataType : string = "";
    values : string[] = [];
    unit : string|null = null;
    timePrecision : number|null = null;

    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.property) this.property = initializer.property;
        if (initializer.dataType) this.dataType = initializer.dataType;
        if (initializer.values){
            let values : string = initializer.values;
            values.split("<space>").map((value) => {
                this.values.push(value);
            })
        }
        if (initializer.unit) this.unit = initializer.unit;
        if (initializer.timePrecision) this.timePrecision = Number.parseInt(initializer.timePrecision);
    }
}