export class Collection {
    collectionID: Number = 0;
    name : string = '';
        
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.collection_id) this.collectionID = initializer.collection_id;
        if (initializer.name) this.name = initializer.name;       
    }
}