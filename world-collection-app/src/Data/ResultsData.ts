export class ResultData {
    qNumber : string = '';
    name : string = '';
    lati : number = 0;
    long : number = 0;
    instanceOf : string = ""

    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.QNumber) this.qNumber = initializer.QNumber;
        if (initializer.name) this.name = initializer.name;
        if (initializer.lati) this.lati = initializer.lati;
        if (initializer.long) this.long = initializer.long;
        if (initializer.instanceOf) this.instanceOf = initializer.instanceOf;
    }
}