export class CollectiblesQuery{
    typeOfCollectiblesLabel : string|null = null;
    typeOfCollectiblesQNumber : string|null = null;   

    restrictionAdministrativeAreaLabel : string|null = null;
    restrictionAdministrativeAreaQNumber : string|null = null;  
    
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.typeOfCollectiblesLabel) this.typeOfCollectiblesLabel = initializer.typeOfCollectiblesLabel;
        if (initializer.typeOfCollectiblesQNumber) this.typeOfCollectiblesQNumber= initializer.typeOfCollectiblesQNumber;

        if (initializer.restrictionAdministrativeAreaLabel) this.restrictionAdministrativeAreaLabel = initializer.restrictionAdministrativeAreaLabel;
        if (initializer.restrictionAdministrativeAreaQNumber) this.restrictionAdministrativeAreaQNumber = initializer.restrictionAdministrativeAreaQNumber;
    }

    setType(label : string,qNumber : string) {
        this.typeOfCollectiblesLabel = label;
        this.typeOfCollectiblesQNumber = qNumber;
    }

    setRestrictionAdministrativeArea(label : string,qNumber : string) {
        this.restrictionAdministrativeAreaLabel = label;
        this.restrictionAdministrativeAreaQNumber = qNumber;
    }

    isReady() {
        if (this.typeOfCollectiblesQNumber !== null && this.restrictionAdministrativeAreaQNumber !== null){
            return true;
        }
        return false;
    }
}