export class Collection {
    collectionID: Number = 0;
    name : string = '';
        
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.collectionID) this.collectionID = initializer.collectionID;
        if (initializer.name) this.name = initializer.name;       
    }
}