export class CollectiblesBaseData {
    qNumber : string = '';
    name : string = '';
    desc : string = '';

    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.QNumber) this.qNumber = initializer.QNumber;
        if (initializer.name) this.name = initializer.name;
        if (initializer.description) this.desc = initializer.description;
    }
}