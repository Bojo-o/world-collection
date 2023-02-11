import { Collection } from "../Data/Database/Colection";
import { Collectible } from "../Data/Database/Collectible";
import { ResultData } from "../Data/ResultsData";

const baseUrl = "DatabaseGateway/";
const getCollectionsUrl = "get/collections"
const getCollectiblessUrl = "get/collectibles"

const postCollectiblesIntoCollection = "post/collectibles"

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
    let collections : Collectible[] = data.map((d : any) => new Collectible(d));
    return collections;
}
export class DatabaseAPI {
    public static getCollections(){
        return this.fetchData(baseUrl + getCollectionsUrl,"").then(convertToCollectionsDataModel);
    }

    public static getCollectiblesInCollection(collectionID : Number){
        console.log(collectionID)
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
    public static postCollectibles(collectionName : string,collectibles : ResultData[]){
        this.postData(baseUrl + postCollectiblesIntoCollection,"Insert collectibles into: " + collectionName,JSON.stringify(collectibles));
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