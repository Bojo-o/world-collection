import { RawCollectible } from "../Data/RawCollectible";
import { FilterData } from "../Data/FiltersData/FilterData";
import { QuantityFilterData, ValueRange } from "../Data/FiltersData/QuantityFilterData";
import { WikibaseItemFilterData } from "../Data/FiltersData/WIkibaseItemFilterData";
import { WikibaseItemPropertyData } from "../Data/FiltersData/WikibaseItemPropertyData";
import { Entity } from "../Data/SearchData/Entity";
import { SearchData } from "../Data/SearchData/SearchData";
import { CollectiblesSearchQueryData } from "../AppStates/CollectiblesSearching/ColectiblesSearchQueryData";
import { CollectibleBasicInfo } from "../Data/CollectibleBasicInfo";
import { CollectibleDetail } from "../Data/CollectibleDetails";

const urlCollectiblesType = "WikidataAPI/search/collectible_allowed_types";
const urlPlacesOrCollectibles = "WikidataAPI/search/placesOrCollectibles";
const urlAdministrativeAreas = "WikidataAPI/search/administrative_areas";
const urlSearchFilters = "WikidataAPI/get/recomended_filters";
const urlSearchFilterData = "WikidataAPI/get/filter_data";
const urlSearchWikibaseItem = "WikidataAPI/search/wikibase_item"
const urlSearchCollectibles = "WikidataAPI/search/collectibles";
const urlSearchRegions = "WikidataAPI/search/regions";
const urlCollectibleDataGetter = "WikidataAPI/get/collectible_data";
const urlCollectibleBasicInfo = "WikidataAPI/get/collectible_basic_info";
const urlCollectibleDetails = "WikidataAPI/get/collectible_details";
const urlCollectibleWikipediaLink = "WikidataAPI/get/collectible_wikipedia_link";


export class WikiDataAPI {
    private static convertToCollectibleModels(data : any[]) : RawCollectible[] {
        let result : RawCollectible[] = data.map((d : any) => new RawCollectible(d));
        return result;
    }
    private static convertToCollectibleModel(data : any) : RawCollectible {
        let result : RawCollectible =  new RawCollectible(data[0]);
        return result;
    }
    private static convertToCollectibleBasicInfo(data : any) : CollectibleBasicInfo {
        let result : CollectibleBasicInfo =  new CollectibleBasicInfo(data[0]);
        return result;
    }
    private static convertToCollectibleDetails(data : any) : CollectibleDetail[] {
        let result : CollectibleDetail[] = data.map((d : any) => new CollectibleDetail(d));
        return result;
    }
    private static convertToWikipediaLink(data : any[]) : string {
        if (data.length == 0){
            return "";
        }
        return data[0]['article'];
    }
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
        
        let result = new WikibaseItemFilterData()
        result.conflict_with_constraint = this.convertToWIkibasePropertyData(data["conflict_with_constraint"])
        result.none_of_constraint = this.convertToWIkibasePropertyData(data["none_of_constraint"])
        result.value_type_constraint= this.convertToWIkibasePropertyData(data["value_type_constraint"])
        result.one_of_constraint = this.convertToWIkibasePropertyData(data["one_of_constraint"])
        
        return result;
    }
    private static convertToQuantityFilterData(data : any) : QuantityFilterData {
        let units : Entity[] = data["units"].map((unit : any) => {
            return new Entity(unit["QNumber"],unit["name"]);
        })
        let range : ValueRange = new ValueRange(data["range"][0]);
        return new QuantityFilterData(units,range)
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
        //let param = new Map<string,string>();
        //if (searchWord !== ""){
        //    param.set("key_word",searchWord)
        //}
        //if (superClass != undefined){
        //    param.set("super_class",superClass)
        //}
        
        //param.set("exceptions",exceptionsClasses.join(","))
        let params = {
            search_word : searchWord,
            super_class : superClass,
            exception_classes : exceptionsClasses
        }
        const data = await this.fetchDataNEW(urlCollectiblesType, JSON.stringify(params));
        return this.convertToSearchDataModel(data);
    }
    static async searchForAdministrativeAreasExceptions(searchWord : string,locatedInArea : string|null,notLocatedInAreas : string[]){
        //let param = new Map<string,string>();
        //if (searchWord !== ""){
        //    param.set("key_word",searchWord)
        //}
        //if (locatedInArea != undefined){
        //param.set("located_in_area",locatedInArea)
        //}
        
        //param.set("not_located_in_area",notLocatedInAreas.join(","))
        let params = {
            search_word : searchWord,
            located_in_area : locatedInArea,
            not_located_in_areas : notLocatedInAreas
        }
        const data = await this.fetchDataNEW(urlAdministrativeAreas, JSON.stringify(params));
        return this.convertToSearchDataModel(data);
    }
    static async searchForFilterDataQuantity(property: string){
        //let param = new Map<string,string>();
        //param.set("property",property)
        //param.set("data_type","Quantity")
        //const data = await this.fetchData(urlSearchFilterData, param);
        let params = {
            property : property,
            data_type : "Quantity"
        }
        const data = await this.fetchDataNEW(urlSearchFilterData,JSON.stringify(params));
        return this.convertToQuantityFilterData(data);
    }
    static async searchForFilterDataWikibaseItem(property: string){
        //let param = new Map<string,string>();
        //param.set("property",property)
        //param.set("data_type","WikibaseItem")
        //const data = await this.fetchData(urlSearchFilterData, param);
        let params = {
            property : property,
            data_type : "WikibaseItem"
        }
        const data = await this.fetchDataNEW(urlSearchFilterData,JSON.stringify(params));
        return this.convertToWikibaseItemFilterData(data);
    }
    static async searchForTypesOfCollectibles(searchWord : string){
        //console.log(searchWord)
        //let param = new Map<string,string>();
        //param.set("key_word",searchWord)
        let params = {
            search_word : searchWord
        }
        const data = await this.fetchDataNEW(urlCollectiblesType, JSON.stringify(params));
        return this.convertToSearchDataModel(data);
    }
    static async searchForCollectible(searchWord : string){
        //let param = new Map<string,string>();
        //param.set("key_word",searchWord)
        let params = {
            search_word : searchWord
        }
        const data = await this.fetchDataNEW(urlPlacesOrCollectibles,JSON.stringify(params));
        return this.convertToSearchDataModel(data);
    }
    static async searchForAdministrativeAreas(searchWord : string){
        //let param = new Map<string,string>();
        //param.set("key_word",searchWord)
        let params = {
            search_word : searchWord,
            
        }
        const data = await this.fetchDataNEW(urlAdministrativeAreas, JSON.stringify(params));
        //const data = await this.fetchData(urlAdministrativeAreas, param);
        return this.convertToSearchDataModel(data);
    }

    static async searchForFilters(QNumberOfType :  string | null = null){
        //let param = new Map<string,string>();
        //console.log(QNumberOfType)
        //if (QNumberOfType != null){
        //    param.set("type",QNumberOfType)
        //}
        let params =  {
            type : QNumberOfType
        }
        const data = await this.fetchDataNEW(urlSearchFilters, JSON.stringify(params));
        return this.convertToFiltersDataModel(data);
    }
    static async searchWikibaseItem(searchWord : string, wikibaseItemFilterData : WikibaseItemFilterData){
        //let param = new Map<string,string>();
        //param.set("key_word",searchWord)
        
        //param.set("value_type",wikibaseItemFilterData.getValueTypeQNumbers())
        //param.set("value_type_relation",wikibaseItemFilterData.getValueTypesRelation())
        //param.set("conflict_type",wikibaseItemFilterData.getConflictTypeQNumbers())
        //param.set("conflict_type_relation",wikibaseItemFilterData.getConflictTypesRelation())
        //param.set("none_values",wikibaseItemFilterData.getNoneValuesQNumbers())
        //const data = await this.fetchData(urlSearchWikibaseItem, param);
        let params  = {
            search_word : searchWord,
            value_type : wikibaseItemFilterData.getValueTypeQNumbers(),
            value_type_relation : wikibaseItemFilterData.getValueTypesRelation(),
            conflict_type : wikibaseItemFilterData.getConflictTypeQNumbers(),
            conflict_type_relation : wikibaseItemFilterData.getConflictTypesRelation(),
            none_values: wikibaseItemFilterData.getNoneValuesQNumbers()
        }
        const data = await this.fetchDataNEW(urlSearchWikibaseItem,JSON.stringify(params));
        return this.convertToSearchDataModel(data);
    }
    static async searchCollectibles(params : CollectiblesSearchQueryData){
        console.log(JSON.stringify(params))
        const data = await this.fetchDataNEW(urlSearchCollectibles,JSON.stringify(params));
        return this.convertToCollectibleModels(data);
    }
    static async searchRegions(searchWord : string){
        let params  = {
            search_word : (searchWord === "") ? null : searchWord
        }
        const data = await this.fetchDataNEW(urlSearchRegions,JSON.stringify(params));
        return this.convertToSearchDataModel(data);
    }
    static async collectibleDataGetter(collectibleQNumber : string){
        let params  = {
            collectible_QNumber : collectibleQNumber
        }
        const data = await this.fetchDataNEW(urlCollectibleDataGetter,JSON.stringify(params));
        return this.convertToCollectibleModel(data);
    }
    static async getCollectibleBasicInfo(collectibleQNumber : string){
        let params  = {
            collectible_QNumber : collectibleQNumber
        }
        const data = await this.fetchDataNEW(urlCollectibleBasicInfo,JSON.stringify(params));
        return this.convertToCollectibleBasicInfo(data);
    }
    static async getCollectibleDetails(collectibleQNumber : string){
        let params  = {
            collectible_QNumber : collectibleQNumber
        }
        const data = await this.fetchDataNEW(urlCollectibleDetails,JSON.stringify(params));
        return this.convertToCollectibleDetails(data);
    }
    static async getCollectibleWikipediaLink(collectibleQNumber : string){
        let params  = {
            collectible_QNumber : collectibleQNumber
        }
        const data = await this.fetchDataNEW(urlCollectibleWikipediaLink,JSON.stringify(params));
        console.log(data)
        return this.convertToWikipediaLink(data);
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

    private static async fetchDataNEW(url : string, data : {}){
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
                'There was an error retrieving the data. Please try again.'
            );
        }
    }
}