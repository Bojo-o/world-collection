export class RawCollectible {
    QNumber : string = '';
    name : string = '';
    lati : number = 0;
    long : number = 0;
    subTypeOf : string = ""
    
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.QNumber) this.QNumber = initializer.QNumber;
        if (initializer.name) this.name = initializer.name;
        if (initializer.lati) this.lati = initializer.lati;
        if (initializer.long) this.long = initializer.long;
        if (initializer.instanceOf) this.subTypeOf = initializer.subTypeOf;
    }
}