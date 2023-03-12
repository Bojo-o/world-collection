import { FilterData } from "../Data/FiltersData/FilterData";
import { WikibaseItemFilterData } from "../Data/FiltersData/WIkibaseItemFilterData";
import { WikibaseItemPropertyData } from "../Data/FiltersData/WikibaseItemPropertyData";
import { Entity } from "../Data/SearchData/Entity";
import { SearchData } from "../Data/SearchData/SearchData";

const urlCollectiblesType = "WikidataAPI/search/classes";
const urlPlaces = "WikidataAPI/search/places";
const urlAdministrativeAreas = "WikidataAPI/search/administrative_areas";
const urlSearchFilters = "WikidataAPI/get/filters";
const urlSearchFilterDataWikibaseItem = "WikidataAPI/get/filter_data";
const urlSearchWikibaseItem = "WikidataAPI/search/wikibase_item"

export class WikiDataAPI {
    private static convertToSearchDataModel(data: any[]) : SearchData[] {
        let results : SearchData[] = data.map((d : any) => new SearchData(d));
        return results;
    }
    private static convertToFiltersDataModel(data : any[]) : FilterData[] {
        let results : FilterData[] = data.map((d : any) => new FilterData(d));
        return results;
    }
    private static convertToWIkibasePropertyData(data : any[]) : WikibaseItemPropertyData[]{
        let results : WikibaseItemPropertyData[] = data.map((d : any) =>{
            return new WikibaseItemPropertyData(d);
        });
        return results;
    }
    private static convertToWikibaseItemFilterData(data : any) : WikibaseItemFilterData {
        console.log(data)
        let result = new WikibaseItemFilterData()
        result.conflict_with_constraint = this.convertToWIkibasePropertyData(data["conflict_with_constraint"])
        result.none_of_constraint = this.convertToWIkibasePropertyData(data["none_of_constraint"])
        result.value_type_constraint= this.convertToWIkibasePropertyData(data["value_type_constraint"])
        result.one_of_constraint = this.convertToWIkibasePropertyData(data["one_of_constraint"])
        
        return result;
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
    static async searchForAdministrativeAreasExceptions(searchWord : string,locatedInArea : string|undefined,notLocatedInAreas : string[]){
        let param = new Map<string,string>();
        if (searchWord !== ""){
            param.set("key_word",searchWord)
        }
        if (locatedInArea != undefined){
            param.set("located_in_area",locatedInArea)
        }
        
        param.set("not_located_in_area",notLocatedInAreas.join(","))
    
        const data = await this.fetchData(urlAdministrativeAreas, param);
        return this.convertToSearchDataModel(data);
    }
    static async searchForFilterDataWikibaseItem(property: string){
        let param = new Map<string,string>();
        param.set("property","P2044")
        param.set("data_type","Quantity")
        const data = await this.fetchData(urlSearchFilterDataWikibaseItem, param);
        return this.convertToWikibaseItemFilterData(data);
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
    static async searchForAdministrativeAreas(searchWord : string){
        let param = new Map<string,string>();
        param.set("key_word",searchWord)
        const data = await this.fetchData(urlAdministrativeAreas, param);
        return this.convertToSearchDataModel(data);
    }

    static async searchForFilters(QNumberOfType :  string){
        let param = new Map<string,string>();
        param.set("type",QNumberOfType)
        const data = await this.fetchData(urlSearchFilters, param);
        return this.convertToFiltersDataModel(data);
    }
    static async searchWikibaseItem(searchWord : string, wikibaseItemFilterData : WikibaseItemFilterData){
        let param = new Map<string,string>();
        param.set("key_word",searchWord)
        
        param.set("value_type",wikibaseItemFilterData.getValueTypeQNumbers())
        param.set("value_type_relation",wikibaseItemFilterData.getValueTypesRelation())
        param.set("conflict_type",wikibaseItemFilterData.getConflictTypeQNumbers())
        param.set("conflict_type_relation",wikibaseItemFilterData.getConflictTypesRelation())
        param.set("none_values",wikibaseItemFilterData.getNoneValuesQNumbers())
        const data = await this.fetchData(urlSearchWikibaseItem, param);
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