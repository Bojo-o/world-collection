export class Collection {
    collectionID: Number = 0;
    name : string = '';
    visited : Number = 0;
    notVisited : Number = 0;
        
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.collection_id) this.collectionID = initializer.collection_id;
        if (initializer.name) this.name = initializer.name;    
        if (initializer.visited) this.visited = initializer.visited;       
        if (initializer.notVisited) this.notVisited = initializer.notVisited;   
    }
}