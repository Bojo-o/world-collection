export class Collection {
    collectionID: number = 0;
    name : string = '';
    visited : number = 0;
    notVisited : number = 0;
        
    constructor(initializer?: any){
        if(!initializer) return;
        if (initializer.collection_id) this.collectionID = initializer.collection_id;
        if (initializer.name) this.name = initializer.name;    
        if (initializer.visited) this.visited = initializer.visited;       
        if (initializer.notVisited) this.notVisited = initializer.notVisited;   

        //
        if (initializer.collectionID) this.collectionID = initializer.collectionID;        
    }

    GetCountOfCollectibles = () => {       
        return +this.visited + +this.notVisited;
    }
}