import { CollectiblesBaseData } from "../Data/ColletiblesBaseData";
import { EntityDetailsData } from "../Data/EntityDetailsData";
import { CollectiblesQuery } from "../Data/Query/CollectiblesResultQuery";
import { ResultData } from "../Data/ResultsData";

const urlCollectiblesType = "API/search/classes";
const urlAdministrativeArea = "API/search/administrative_area";
const urlEntityDetails = "API/wikidata/detail/details";

const urlQuery = "API/wikidata/query";

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
function convertToEntityDetailsDataModel(data : any[]) : EntityDetailsData {
    let details : EntityDetailsData = new EntityDetailsData(data);
    return details;
}

function convertToCollectiblesBaseDataModels(data: any[]) : CollectiblesBaseData[] {
    let collectibles : CollectiblesBaseData[] = data.map((d : any) => new CollectiblesBaseData(d));
    return collectibles;
}

function convertToResultDataModels(data : any[]) : ResultData[] {
    let resultData : ResultData[] = data.map((d : any) => new ResultData(d));
    return resultData;
}
export class SearchAPI {
    static getEntityDetails(entity : ResultData){
        let urlParameters = `entity=${entity.QNumber}`;
        return fetch(`${urlEntityDetails}?${urlParameters}`)
        .then(checkStatus)
        .then(parseJson)
        .then(convertToEntityDetailsDataModel)
        .catch((e : TypeError) => {
            console.log('log client error ' + e);
            throw new Error(
            'There was an error retrieving the data. Please try again.'
            );
        })
    }
    static getQueryResult(data : CollectiblesQuery){
        let postFixUrl = `classes=${data.typeOfCollectiblesQNumber}&locations=${data.restrictionAdministrativeAreaQNumber}`
        return fetch(`${urlQuery}?${postFixUrl}`)
        .then(checkStatus)
        .then(parseJson)
        .then(convertToResultDataModels)
        .catch((e : TypeError) => {
            console.log('log client error ' + e);
            throw new Error(
            'There was an error retrieving the data. Please try again.'
            );
        })
    }

    static getTypeOfCollectibles(searchWord : string){
        return this.fetchData(searchWord,urlCollectiblesType);
    }
    static getAdministrativeArea(searchWord : string){
        return this.fetchData(searchWord,urlAdministrativeArea);
    }
    private static fetchData(searchWord : string,url : string){
        return fetch(`${url}?word=${searchWord}`)
        .then(checkStatus)
        .then(parseJson)
        .then(convertToCollectiblesBaseDataModels)
        .catch((e : TypeError) => {
            console.log('log client error ' + e);
            throw new Error(
            'There was an error retrieving the data. Please try again.'
            );
        })
    }
}

