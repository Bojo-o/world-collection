/**
 * Data model wrapping QNumber of some entity, which exists on Wikidata, and name of that entity.
 */
export class Entity{
    private QNumber : string;
    private name : string;
    
    constructor (QNumber : string,name : string){
        this.QNumber = QNumber;
        this.name = name;
    }

    public getQNumber(){
        return this.QNumber;
    }
    public getName(){
        return this.name;
    }
}