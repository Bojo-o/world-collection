import { DateWithPrecision } from "../Data/TimeModels/DateWithPrecision";
import { Collection } from "../Data/DatabaseModels/Colection";
import { Collectible } from "../Data/DatabaseModels/Collectible";
import { RawCollectible } from "../Data/CollectibleModels/RawCollectible";
import { Fetch } from "./Fetch";

// URLS CONSTANTS
const baseDatabaseAPIUrl = "DatabaseAPI/";

const getAllCollections = "get/collections";
const getAllCollectiblesInCollection = "get/collectibles";
const askIfCollectionExists = "get/exists_collections";

const postPushCollectiblesIntoCollection = "post/collectibles";
const postVisitation = "post/set_visit";
const postCollectionRename = "post/collection_update_rename";
const postCollectionDelete = "post/collection_update_delete";
const postCollectionsMerge = "post/collection_update_merge";
const postCollectibleDelete = "/post/collectible_delete";
const postCollectibleRename = "/post/collectible_update_name";
const postCreateCollection = "/post/collection_creation";
const postCollectibleSetIcon = "/post/collectible_update_icon";
const postSetIconForAllCollectiblesInCollection = "/post/collectibles_in_collection_update_icons";
const postCollectibleSetNotes = "/post/collectible_update_notes";

/**
 * Class for posting data to backend Database API and then retriving data or status from backend Database API.
 */
export class DatabaseAPI {
    private static convertToStatusMSG(data: any): string {
        return data['status'];
    }
    private static convertToListOfCollectionDataModel(data: any[]): Collection[] {
        let collections: Collection[] = data.map((d: any) => new Collection(d));
        return collections;
    }
    private static convertToListOfCollectibleDataModel(data: any[]): Collectible[] {
        let collectibles: Collectible[] = data.map((d: any) => new Collectible(d));
        return collectibles;
    }
    private static convertToAskedResult(data: any): boolean {
        let result = data['result'];
        return (result == "1") ? true : false;
    }
    /**
     * Asks Database API if there exists collection with given name.
     * @param name Name, which we want to check if is already used.
     * @returns True if name is taken.
     */
    public static async existsCollectionWithName(name: string) {
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + askIfCollectionExists,
            {
                'name': name,
            });
        return this.convertToAskedResult(data);
    }
    /**
     * Obtains from Database API all collections.
     * @returns Array of Collections.
     */
    public static async getAllCollections() {
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + getAllCollections, {});
        return data.then(this.convertToListOfCollectionDataModel);
    }
    /**
     * Obtains from Database API all collectibles, which belong to given collection.
     * @param collectionID Number of collection, from whom we want to obtain collectibles.
     * @returns Array of Collectibles.
     */
    public static async getCollectiblesInCollection(collectionID: Number) {
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + getAllCollectiblesInCollection, {
            'collectionID': collectionID
        });
        return data.then(this.convertToListOfCollectibleDataModel);
    }
    /**
     * Posts visitation of collectible to Database API.
     * @param QNumberOfCollectible QNumber of collectible, whose visit we will update.
     * @param isVisit Truth value, if this collectible was visited by user.
     * @param dateFormat Data of visit format, that posts and saves for future use so that fronted can display the date of visit correctly.
     * @param dateFrom Date of visit, if we set also dateTo , then it represents staring point of range of visit.
     * @param dateTo Ending point of range of visit.
     * @returns Status message, if this process was successful.
     */
    public static async setCollectibleVisitation(QNumberOfCollectible: string, isVisit: boolean, dateFormat: string | null = null, dateFrom: DateWithPrecision | null = null, dateTo: DateWithPrecision | null = null) {
        let dateFromString: string = 'null'
        let dateToString: string = 'null'
        if (dateFrom != null) {
            dateFromString = dateFrom.getDate();
        }
        if (dateTo != null) {
            dateToString = dateTo.getDate();
        }
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + postVisitation,
            {
                'QNumber': QNumberOfCollectible,
                'isVisit': isVisit,
                'dateFormat': dateFormat,
                'dateFrom': dateFromString,
                'dateTo': dateToString
            });
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts collectibles to Database API, which saves collectibles into given collection.
     * @param collectionID ID Number of collection.
     * @param collectibles Collectibles, which we want to add into collection.
     * @returns Status message, if this process was successful.
     */
    public static async addCollectiblesIntoCollection(collectionID: number, collectibles: RawCollectible[]) {
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + postPushCollectiblesIntoCollection,
            {
                'collectibles': collectibles,
                'collectionID': collectionID
            });
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts command to Database API to create a new collection.
     * @param collectionName Name of the new collection.
     * @returns Status message, if this process was successful.
     */
    public static async postCollectionCreation(collectionName: string) {
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + postCreateCollection,
            {
                'collection_name': collectionName
            });
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts update to Database API to change collection name.
     * @param updatedCollectionID ID of existed collection.
     * @param newName A new name of collection.
     */
    public static postCollectionUpdateRename(updatedCollectionID: Number, newName: string) {
        Fetch.postAndFetch(baseDatabaseAPIUrl + postCollectionRename,
            {
                'CollectionID': updatedCollectionID,
                'newName': newName
            }
        );
    }
    /**
     * Posts command to Database API to delete given collection.
     * Note that, each collectible belonging to this collection will be deleted.
     * @param CollectionID ID of existed collection.
     */
    public static postCollectionUpdateDelete(CollectionID: Number) {
        Fetch.postAndFetch(baseDatabaseAPIUrl + postCollectionDelete,
            {
                'CollectionID': CollectionID
            }
        );
    }
    /**
     * Posts commnad to Database API to merge two collections into one.
     * Each collectible from collection will be updated to belong to a new collection.
     * @param CollectionID ID of collection, which will be merged into other.
     * @param newCollectionID ID of collection, into which collectibles will be moved.
     */
    public static postCollectionUpdateMerge(CollectionID: Number, newCollectionID: Number) {
        Fetch.postAndFetch(baseDatabaseAPIUrl + postCollectionsMerge,
            {
                'CollectionID': CollectionID,
                'NewCollectionID': newCollectionID
            }
        );
    }
    /**
     * Posts command to Database API to delete given collectible from the collection.
     * @param collectibleQNumber QNUmber of collectible, which will be deleted.
     * @param CollectionID ID of collection, in which collectible resides.
     */
    public static postCollectibleDeletion(collectibleQNumber: string, CollectionID: Number) {
        Fetch.postAndFetch(baseDatabaseAPIUrl + postCollectibleDelete,
            {
                'q_number': collectibleQNumber,
                'CollectionID': CollectionID
            }
        )
    }
    /**
     * Posts command to Database API to change name of given collectible.
     * @param collectibleQNumber QNUmber of collectible, which name will be updated.
     * @param newName A new name of collectible.
     */
    public static postCollectibleUpdateName(collectibleQNumber: string, newName: string) {
        Fetch.postAndFetch(baseDatabaseAPIUrl + postCollectibleRename,
            {
                'q_number': collectibleQNumber,
                'name': newName
            }
        )
    }
    /**
     * Posts command to Database API to change icon of given collectible.
     * @param collectibleQNumber QNumber of collectible, whose icon will be changed.
     * @param icon Name of icon, which is used for rendering.
     * @returns Status message, if this process was successful.
     */
    public static async postCollectibleUpdateIcon(collectibleQNumber: string, icon: string) {
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + postCollectibleSetIcon,
            {
                'q_number': collectibleQNumber,
                'icon': icon
            }
        )
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts command to Database API to change icon for all collectibles in given collection.
     * @param collectionID ID of collection.
     * @param icon Name of icon, which is used for rendering.
     * @returns  Status message, if this process was successful.
     */
    public static async postCollectiblesInCollectionUpdateIcon(collectionID: number, icon: string) {
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + postSetIconForAllCollectiblesInCollection,
            {
                'collectionID': collectionID,
                'icon': icon
            }
        )
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts command to Database API to change notes for given collectible.
     * @param collectibleQNumber QNUmber of collectible, whose notes will be updated.
     * @param notes Information, which user want to save to collectible.
     * @returns  Status message, if this process was successful.
     */
    public static async postCollectibleUpdateNotes(collectibleQNumber: string, notes: string | null) {
        let data = Fetch.postAndFetch(baseDatabaseAPIUrl + postCollectibleSetNotes,
            {
                'q_number': collectibleQNumber,
                'notes': notes
            }
        )
        return this.convertToStatusMSG(data);
    }

}