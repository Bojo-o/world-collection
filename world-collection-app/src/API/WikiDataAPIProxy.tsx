import { RawCollectible } from "../Data/CollectibleModels/RawCollectible";
import { FilterIdentificationData } from "../Data/FilterModels/FilterIdentificationData";
import { QuantityFilterData, ValueRange } from "../Data/FilterModels/QuantityFilterModel/QuantityFilterData";
import { WikibaseItemFilterData } from "../Data/FilterModels/WikibaseItemFilterModel/WIkibaseItemFilterData";
import { WikibaseItemPropertyData } from "../Data/FilterModels/WikibaseItemFilterModel/WikibaseItemPropertyData";
import { Entity } from "../Data/DataModels/Entity";
import { SearchData } from "../Data/DataModels/SearchData";
import { CollectiblesSearchQueryData } from "../Data/CollectibleSearching/ColectiblesSearchQueryData";
import { CollectibleBasicInfo } from "../Data/CollectibleModels/CollectibleBasicInfo";
import { CollectibleDetail } from "../Data/CollectibleModels/CollectibleDetails";
import { Fetch } from "./Fetch";

// API ENDPOINTS
const searchCollectiblesTypes = "WikidataAPI/search/collectible_allowed_types";
const searchPlacesOrCollectibles = "WikidataAPI/search/placesOrCollectibles";
const searchAdministrativeAreas = "WikidataAPI/search/administrative_areas";
const getRecomendedFilters = "WikidataAPI/get/recomended_filters";
const getFilterData = "WikidataAPI/get/filter_data";
const searchWikibaseItem = "WikidataAPI/search/wikibase_item"
const searchCollectibles = "WikidataAPI/search/collectibles";
const searchRegions = "WikidataAPI/search/regions";
const getCollectibleData = "WikidataAPI/get/collectible_data";
const getCollectibleBasicInfo = "WikidataAPI/get/collectible_basic_info";
const getCollectibleDetails = "WikidataAPI/get/collectible_details";
const getCollectibleWikipediaLink = "WikidataAPI/get/collectible_wikipedia_link";

/**
 * Class for obtaining data from backend Wikidata API.
 */
export class WikiDataAPIProxy {
    private static convertToListOfCollectibleModel(data: any[]): RawCollectible[] {
        let result: RawCollectible[] = data.map((d: any) => new RawCollectible(d));
        return result;
    }
    private static convertToCollectibleModel(data: any): RawCollectible {
        let result: RawCollectible = new RawCollectible(data[0]);
        return result;
    }
    private static convertToCollectibleBasicInfoModel(data: any): CollectibleBasicInfo {
        let result: CollectibleBasicInfo = new CollectibleBasicInfo(data[0]);
        return result;
    }
    private static convertToListOFCollectibleDetailModel(data: any): CollectibleDetail[] {
        let result: CollectibleDetail[] = data.map((d: any) => new CollectibleDetail(d));
        return result;
    }
    private static convertToWikipediaLinkUrl(data: any[]): string {
        if (data.length === 0) {
            return "";
        }
        return data[0]['article'];
    }
    private static convertToListOfSearchDataModel(data: any[]): SearchData[] {
        let results: SearchData[] = data.map((d: any) => new SearchData(d));
        return results;
    }

    private static convertToListOfFilterDataModel(data: any[]): FilterIdentificationData[] {
        let results: FilterIdentificationData[] = data.map((d: any) => new FilterIdentificationData(d));
        return results;
    }
    private static convertToListOfWIkibasePropertyDataModel(data: any[]): WikibaseItemPropertyData[] {
        let results: WikibaseItemPropertyData[] = data.map((d: any) => {
            return new WikibaseItemPropertyData(d);
        });
        return results;
    }
    private static convertToWikibaseItemFilterDataModel(data: any): WikibaseItemFilterData {

        let result = new WikibaseItemFilterData()
        result.conflict_with_constraint = this.convertToListOfWIkibasePropertyDataModel(data["conflict_with_constraint"])
        result.none_of_constraint = this.convertToListOfWIkibasePropertyDataModel(data["none_of_constraint"])
        result.value_type_constraint = this.convertToListOfWIkibasePropertyDataModel(data["value_type_constraint"])
        result.one_of_constraint = this.convertToListOfWIkibasePropertyDataModel(data["one_of_constraint"])

        return result;
    }
    private static convertToQuantityFilterDataModel(data: any): QuantityFilterData {
        let units: Entity[] = data["units"].map((unit: any) => {
            return new Entity(unit["QNumber"], unit["name"]);
        })
        let range: ValueRange = new ValueRange(data["range"][0]);
        return new QuantityFilterData(units, range)
    }

    /**
     * Obtains from WikidataAPI data of filter, which are necessary for future use.
     * @param property PNUmber of property/filter of which we want to obtain data.
     * @returns Data model containing data of filter such as max,min value restriction and list of supported units.
     */
    static async getQuantityFilterData(property: string) {
        let params = {
            property: property,
            data_type: "Quantity"
        }
        const data = await Fetch.Get(getFilterData, params);
        return this.convertToQuantityFilterDataModel(data);
    }
    /**
     * Obtains from WikidataAPI data of filter, which are necessary for future use.
     * @param property PNUmber of property/filter of which we want to obtain data.
     * @returns Data model containing data of WikibaseItem filter.
     */
    static async getWikibaseItemFilterData(property: string) {
        let params = {
            property: property,
            data_type: "WikibaseItem"
        }
        const data = await Fetch.Get(getFilterData, params);
        return this.convertToWikibaseItemFilterDataModel(data);
    }
    /**
     * Searches for allowed types/classes, which collectibles could be instance of.
     * @param searchWord Key word that the search results must contain.
     * @returns Data model containing list of the found data.
     */
    static async searchForTypesOfCollectibles(searchWord: string) {
        let params = {
            search_word: searchWord
        }
        const data = await Fetch.Get(searchCollectiblesTypes, params);
        return this.convertToListOfSearchDataModel(data);
    }
    /**
     * Searches for sub types of given type.
     * @param searchWord  Key word that the search results must contain.
     * @param superClass QNumber of class/type. Results must be sub-class of it.
     * @param exceptionClasses Array of exception classes, found results can not be sub-class of those exception classes.
     * @returns Data model containing list of the found data.
     */
    static async searchForSubTypesOfTypesOfCollectibles(searchWord: string, superClass: string, exceptionClasses: string[]) {
        let params = {
            search_word: searchWord,
            super_class: superClass,
            exception_classes: exceptionClasses
        }
        const data = await Fetch.Get(searchCollectiblesTypes, params);
        return this.convertToListOfSearchDataModel(data);
    }
    /**
     * Searches for collectible.
     * @param searchWord Key word that the search results must contain.
     * @returns Data model containing list of the found data.
     */
    static async searchForCollectible(searchWord: string) {
        let params = {
            search_word: searchWord
        }
        const data = await Fetch.Get(searchPlacesOrCollectibles,params);
        return this.convertToListOfSearchDataModel(data);
    }
    /**
     * Searches for administrative areas.
     * @param searchWord Key word that the search results must contain.
     * @returns Data model containing list of the found data.
     */
    static async searchForAdministrativeAreas(searchWord: string) {
        let params = {
            search_word: searchWord,

        }
        const data = await Fetch.Get(searchAdministrativeAreas, params);
        return this.convertToListOfSearchDataModel(data);
    }
    /**
     * Searches for administrative areas, which locate in given administrative area.
     * @param searchWord Key word that the search results must contain.
     * @param superAdministrativeArea QNumber of administrative area. Found results must locate in this given area.
     * @param exceptionAdministrativeAreas Array of QNumbers of exception areas. Found results can not locate in those exception areas.
     * @returns Data model containing list of the found data.
     */
    static async searchForSubAdministrativeAreasOfArea(searchWord: string, superAdministrativeArea: string | null, exceptionAdministrativeAreas: string[]) {
        let params = {
            search_word: searchWord,
            located_in_area: superAdministrativeArea,
            not_located_in_areas: exceptionAdministrativeAreas
        }
        const data = await Fetch.Get(searchAdministrativeAreas, params);
        return this.convertToListOfSearchDataModel(data);
    }
    /**
     * Searches for filters that make sense for given type.
     * So for type "city" it should find filter "population".
     * @param QNumberOfType QNumber of class/type, for which we want to obtain filters.
     * @returns Data model containing filters.
     */
    static async searchForFilters(QNumberOfType: string | null = null) {
        let params = {
            type: QNumberOfType
        }
        const data = await Fetch.Get(getRecomendedFilters, params);
        return this.convertToListOfFilterDataModel(data);
    }
    /**
     * Searches for WikibaseItem.
     * @param searchWord  Key word that the search results must contain.
     * @param wikibaseItemFilterData Data model, which contains search restrictions. For example it contains information about
     *  conflict type meaning the found results can not be instance, sub-type of conflict type.
     * @returns Data model containing list of the found data.
     */
    static async searchForWikibaseItem(searchWord: string, wikibaseItemFilterData: WikibaseItemFilterData) {
        let params = {
            search_word: searchWord,
            value_type: wikibaseItemFilterData.getValueTypeQNumbers(),
            value_type_relation: wikibaseItemFilterData.getValueTypesRelation(),
            conflict_type: wikibaseItemFilterData.getConflictTypeQNumbers(),
            conflict_type_relation: wikibaseItemFilterData.getConflictTypesRelation(),
            none_values: wikibaseItemFilterData.getNoneValuesQNumbers()
        }
        const data = await Fetch.Get(searchWikibaseItem, params);
        return this.convertToListOfSearchDataModel(data);
    }
    /**
     * Searches for collectibles satisfying given parameters.
     * @param params Data model, which contains requirments fro collectible searching such as area restriction, type restriction and filters.
     * @returns List of found collectibles, which satisfies given parameters.
     */
    static async searchForCollectibles(params: CollectiblesSearchQueryData) {
        const data = await Fetch.Get(searchCollectibles, params);
        return this.convertToListOfCollectibleModel(data);
    }
    /**
     * Searches for world regions such as Europe or East Asia.
     * @param searchWord Key word that the search results must contain.
     * @returns Data model containing list of the found data.
     */
    static async searchForRegions(searchWord: string) {
        let params = {
            search_word: (searchWord === "") ? null : searchWord
        }
        const data = await Fetch.Get(searchRegions, params);
        return this.convertToListOfSearchDataModel(data);
    }
    /**
     * Obtains from Wikidata API collectible data necessary for data model representing collectible.
     * @param collectibleQNumber QNumber of collectible.
     * @returns Data model representing collectible.
     */
    static async getCollectibleData(collectibleQNumber: string) {
        let params = {
            collectible_QNumber: collectibleQNumber
        }
        const data = await Fetch.Get(getCollectibleData, params);
        return this.convertToCollectibleModel(data);
    }
    /**
     * Obtains from Wikidata API colectible description and image, if image exists.
     * @param collectibleQNumber QNumber of collectible.
     * @returns Data model containing collectible description and image.
     */
    static async getCollectibleBasicInfo(collectibleQNumber: string) {
        let params = {
            collectible_QNumber: collectibleQNumber
        }
        const data = await Fetch.Get(getCollectibleBasicInfo, params);
        return this.convertToCollectibleBasicInfoModel(data);
    }
    /**
     * Obtains from Wikidata API all related details of given collectible.
     * @param collectibleQNumber QNUmber of collectible.
     * @returns Data model cointaining collectible details.
     */
    static async getCollectibleDetails(collectibleQNumber: string) {
        let params = {
            collectible_QNumber: collectibleQNumber
        }
        const data = await Fetch.Get(getCollectibleDetails, params);
        return this.convertToListOFCollectibleDetailModel(data);
    }
    /**
     * Obtains from Wikidata API link to wikipedia article.
     * @param collectibleQNumber QNUmber of collectible.
     * @returns String URL to Wikipedia article about given collectible if exists.
     */
    static async getCollectibleWikipediaLink(collectibleQNumber: string) {
        let params = {
            collectible_QNumber: collectibleQNumber
        }
        const data = await Fetch.Get(getCollectibleWikipediaLink, params);
        return this.convertToWikipediaLinkUrl(data);
    }
}