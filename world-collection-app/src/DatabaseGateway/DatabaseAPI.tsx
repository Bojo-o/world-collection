import { CustomDate } from "../Data/CustomDate";
import { Collection } from "../Data/Database/Colection";
import { Collectible } from "../Data/Database/Collectible";
import { ResultData } from "../Data/ResultsData";

const baseUrl = "DatabaseGateway/";
const getCollectionsUrl = "get/collections"
const getCollectiblessUrl = "get/collectibles"
const askForExistanceOfCollections = "/get/exists_collections"


const postCollectiblesIntoCollection = "post/collectibles"
const postVisitation = "post/set_visit"
const postCollectionUpdateRename = "post/collection_update_rename"

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
        this.postData(baseUrl + postVisitation,"Set visitation",JSON.stringify(
            {
            'QNumber': QNumberOfCollectible,
            'isVisit' : isVisit,
            'dateFormat' : dateFormat,
            'dateFrom' : dateFromString,
            'dateTo' : dateToString
        }));
    }
    public static postCollectibles(collectionName : string,collectibles : ResultData[]){
        this.postData(baseUrl + postCollectiblesIntoCollection,"Insert collectibles into: " + collectionName,JSON.stringify(collectibles));
    }
    public static postCollectionUpdateRename(updatedCollectionID : Number,newName : string){
        this.postData(baseUrl + postCollectionUpdateRename,"Rename collection: " + updatedCollectionID,JSON.stringify(
            {
                'CollectionID' : updatedCollectionID,
                'newName' : newName
            }
        ));
    }

    private static postData(url : string,title: string,data : string){
        fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                body: data
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {           
            console.log(error)
        })  
    }
}