import { SearchData } from "../Data/SearchData/SearchData";

const urlCollectiblesType = "WikidataAPI/search/classes";
const urlPlaces = "WikidataAPI/search/places";

export class WikiDataAPI {
    private static convertToSearchDataModel(data: any[]) : SearchData[] {
        let results : SearchData[] = data.map((d : any) => new SearchData(d));
        return results;
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
    static async searchForTypesOfCollectiblesExceptions(searchWord : string,superClass : string|undefined,exceptionsClasses : string[]){
        let param = new Map<string,string>();
        if (searchWord !== ""){
            param.set("key_word",searchWord)
        }
        if (superClass != undefined){
            param.set("super_class",superClass)
        }
        
        param.set("exceptions",exceptionsClasses.join(","))
    
        const data = await this.fetchData(urlCollectiblesType, param);
        return this.convertToSearchDataModel(data);
    }
    static async searchForTypesOfCollectibles(searchWord : string){
        let param = new Map<string,string>();
        param.set("key_word",searchWord)
        const data = await this.fetchData(urlCollectiblesType, param);
        return this.convertToSearchDataModel(data);
    }
    static async searchForPlaces(searchWord : string){
        let param = new Map<string,string>();
        param.set("key_word",searchWord)
        const data = await this.fetchData(urlPlaces, param);
        return this.convertToSearchDataModel(data);
    }
    private static async fetchData(url : string,params : Map<string,string>){
        let parameters = "";
        for (let [key, value] of params) {
            parameters = parameters.concat(`${key}=${value}&`)        
        }
        try {
            const response = await fetch(`${url}?${parameters}`);
            const response_1 = await this.checkStatus(response);
            return this.parseJson(response_1);
        } catch (e) {
            throw new Error(
                'There was an error retrieving the data. Please try again.'
            );
        }
    }
}