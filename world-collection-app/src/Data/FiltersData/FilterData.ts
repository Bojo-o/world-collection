export enum FilterDataType{
    Quantity = "Quantity",
    Time = "Time",
    WikibaseItem = "Item",
    NotSupported = "Not supported"
}
export class FilterData {
    PNumber : string = '';
    name : string = '';
    desc : string = '';
    dataType : FilterDataType = FilterDataType.NotSupported;
    
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.PNumber) this.PNumber = initializer.PNumber;
        if (initializer.name) this.name = initializer.name;
        if (initializer.description) this.desc = initializer.description;
        if (initializer.dataType) {
            if (initializer.dataType == "Quantity"){
                this.dataType = FilterDataType.Quantity;
            }
            if (initializer.dataType == "Time"){
                this.dataType = FilterDataType.Time;
            }
            if (initializer.dataType == "WikibaseItem"){
                this.dataType = FilterDataType.WikibaseItem;
            }
            
        }
    }
}