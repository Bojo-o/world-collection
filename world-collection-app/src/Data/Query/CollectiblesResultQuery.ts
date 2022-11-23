export class CollectiblesQuery{
    typeOfCollectiblesLabel : string|null = null;
    typeOfCollectiblesQNumber : string|null = null;   
    
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.label) this.typeOfCollectiblesLabel = initializer.typeOfCollectiblesLabel;
        if (initializer.name) this.typeOfCollectiblesQNumber= initializer.typeOfCollectiblesQNumber;
    }

    setType(label : string,qNumber : string) {
        this.typeOfCollectiblesLabel = label;
        this.typeOfCollectiblesQNumber = qNumber;
    }
}