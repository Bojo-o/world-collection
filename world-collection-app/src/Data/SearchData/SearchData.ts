export class SearchData {
    QNumber : string = '';
    name : string = '';
    desc : string = '';
    lati : string = '';
    long : string = '';

    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.QNumber) this.QNumber = initializer.QNumber;
        if (initializer.name) this.name = initializer.name;
        if (initializer.description) this.desc = initializer.description;
        if (initializer.lati) this.lati = initializer.lati;
        if (initializer.long) this.long = initializer.long;
    }
}