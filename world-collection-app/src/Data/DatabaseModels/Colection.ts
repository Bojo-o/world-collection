/**
 * Collection Interface.
 * Properties names coresponds with names of collection on the backend.
 */
export interface ICollection{
    collection_id : number,
    name : string,
    visited : number,
    notVisited : number
}
/**
 * Data model representing collection.
 */
export class Collection {
    /**The unique ID of collection */
    collectionID: number;
    /** Name of collection */
    name : string ;
    /** Number of collectibles, which have been already visited by user and belong to this collection */
    visitedCollectibles : number;
    /** Number of collectibles, which have not been visited yet by user and belong to this collection*/
    notVisitedCollectibles : number;

    constructor({collection_id,name,visited,notVisited} : ICollection){
        this.collectionID = collection_id;
        this.name = name;
        this.visitedCollectibles = visited;
        this.notVisitedCollectibles = notVisited;
    }

    getObject = () => {
        return {collection_id : this.collectionID,name : this.name,visited : this.visitedCollectibles,notVisited : this.notVisitedCollectibles}
    }
    /**
     * Help method for computing number of all collectibles belonging to the collection.
     * @returns Number of all collectibles, which belong to the collection.
     */
    getCountOfCollectibles = () => {       
        return +this.visitedCollectibles + +this.notVisitedCollectibles;
    }
}