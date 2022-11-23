import { CollectiblesBaseData } from "../Data/ColletiblesBaseData";

const urlCollectiblesType = "API/search/classes";
const urlAdministrativeArea = "API/search/administrative_area";

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

function convertToCollectiblesBaseDataModels(data: any[]) : CollectiblesBaseData[] {
    let collectibles : CollectiblesBaseData[] = data.map((d : any) => new CollectiblesBaseData(d));
    return collectibles;
}
export class SearchAPI {
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

