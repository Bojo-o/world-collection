import { json } from "stream/consumers";
import { CustomDate } from "../Data/CustomDate";
import { Collection } from "../Data/Database/Colection";
import { Collectible } from "../Data/Database/Collectible";
import { RawCollectible } from "../Data/RawCollectible";

const baseUrl = "DatabaseGateway/";
const getCollectionsUrl = "get/collections"
const getCollectiblessUrl = "get/collectibles"
const askForExistanceOfCollections = "/get/exists_collections"


const postCollectiblesIntoCollection = "post/collectibles"
const postVisitation = "post/set_visit"
const postCollectionUpdateRename = "post/collection_update_rename"
const postCollectionUpdateDelete = "post/collection_update_delete"
const postCollectionUpdateMerge = "post/collection_update_merge"

const postCollectibleDelete="/post/collectible_delete"
const postCollectibleUpdateName="/post/collectible_update_name"
const postCollectionCreation = "/post/collection_creation"

function checkStatus(response: any){
    if (response.ok){
        return response;
    }else {
        const httpErrorInfo = {
            status : response.status,
            statusText : response.statusText,
            url : response.url,
        }

        console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);
        let errorMessage = "Something went wrong...";
        throw new Error(errorMessage);
    }
}
function parseJson(response : Response){
    return response.json();
}

function convertToCollectionsDataModel(data : any[]) : Collection[] {
    let collections : Collection[] = data.map((d : any) => new Collection(d));
    return collections;
}
function convertToCollectiblesDataModel(data : any[]) : Collectible[] {
    let collectibles : Collectible[] = data.map((d : any) => new Collectible(d));
    console.log(collectibles)
    return collectibles;
}
function convertToAskedResultModel(data : any) : boolean {
    let result = data['result'];
    return (result == "1") ? true : false;
}
export class DatabaseAPI {
    public static convertToStatusMSG(data : any) : string {
        return data['status'];
    }
    private static checkStatus(response: any){
        if (response.ok){
            return response;
        }else {
            const httpErrorInfo = {
                status : response.status,
                statusText : response.statusText,
                url : response.url,
            }
            console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);
            throw new Error("Something went wrong...");
        }
    }
    private static parseJson(response : Response){
        return response.json();
    }
    public static askIfExistsCollections(name : string){
        return this.fetchData(baseUrl + askForExistanceOfCollections,`name=${name}`).then(convertToAskedResultModel);
    }
    public static getCollections(){
        return this.fetchData(baseUrl + getCollectionsUrl,"").then(convertToCollectionsDataModel);
    }

    public static getCollectiblesInCollection(collectionID : Number){
        return this.fetchData(baseUrl + getCollectiblessUrl,`collectionID=${collectionID}`).then(convertToCollectiblesDataModel)
    }
    private static fetchData(url : string,param : string){
        return fetch(`${url}?${param}`)
        .then(checkStatus)
        .then(parseJson)
        .catch((e : TypeError) => {
            console.log('log client error ' + e);
            throw new Error(
            'There was an error retrieving the data. Please try again.'
            );
        })
    }
    public static postVisitation(QNumberOfCollectible : string,isVisit : boolean,dateFormat : string|null=null,dateFrom : CustomDate|null=null,dateTo : CustomDate|null=null){
        let dateFromString  : string = 'null'
        let dateToString  : string = 'null'
        if (dateFrom != null){
            dateFromString = dateFrom.GetDate();
        }
        if (dateTo != null){
            dateToString = dateTo.GetDate();
        }
        this.postData(baseUrl + postVisitation,
            {
            'QNumber': QNumberOfCollectible,
            'isVisit' : isVisit,
            'dateFormat' : dateFormat,
            'dateFrom' : dateFromString,
            'dateTo' : dateToString
        });
    }
    
    public static async postCollectibles(collectionID : number,collectibles : RawCollectible[]){
        let data = await this.postData(baseUrl + postCollectiblesIntoCollection,
            {
            'collectibles' : collectibles,
            'collectionID' : collectionID
        });
        return this.convertToStatusMSG(data);
    }
    public static async postCollectionCreation(collectionName : string){
        let data = await this.postData(baseUrl + postCollectionCreation,
            {
            'collection_name' : collectionName
        });
        return this.convertToStatusMSG(data);
    }

    public static postCollectionUpdateRename(updatedCollectionID : Number,newName : string){
        this.postData(baseUrl + postCollectionUpdateRename,
            {
                'CollectionID' : updatedCollectionID,
                'newName' : newName
            }
        );
    }
    public static postCollectionUpdateDelete(CollectionID : Number){
        this.postData(baseUrl + postCollectionUpdateDelete,
            {
                'CollectionID' : CollectionID
            }
        );
    }
    public static postCollectionUpdateMerge(CollectionID : Number,newCollectionID : Number){
        this.postData(baseUrl + postCollectionUpdateMerge,
            {
                'CollectionID' : CollectionID,
                'NewCollectionID' : newCollectionID
            }
        );
    }
    public static postCollectibleDeletion(collectibleQNumber : string,CollectionID : Number){
        this.postData(baseUrl + postCollectibleDelete,
            {
                'q_number' : collectibleQNumber,
                'CollectionID' : CollectionID
            }
        )
    }
    public static postCollectibleUpdateName(collectibleQNumber : string,newName : string){
        this.postData(baseUrl + postCollectibleUpdateName,
            {
                'q_number' : collectibleQNumber,
                'name' : newName
            }
        )
    }
    private static async postData(url : string,data : {}){
        try {
            const response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }
            );
            const response_1 = await this.checkStatus(response);
            return this.parseJson(response_1);
        } catch (e) {
            throw new Error(
                'There was an error. Please try again.'
            );
        }
    }
}