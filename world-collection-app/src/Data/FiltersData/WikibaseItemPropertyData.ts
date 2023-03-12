export class WikibaseItemPropertyData {
    QNumber : string = '';
    name : string = '';
    relationQNumber : string = '';
    relation : string = '';

    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.QNumber) this.QNumber = initializer.QNumber;
        if (initializer.name) this.name = initializer.name;
        if (initializer.relationQNumber) this.relationQNumber = initializer.relationQNumber;
        if (initializer.relation) this.relation = initializer.relation;
    }
}