import { DateWithPrecision } from "../Data/TimeModels/DateWithPrecision";
import { Collection } from "../Data/DatabaseModels/Colection";
import { Collectible } from "../Data/DatabaseModels/Collectible";
import { RawCollectible } from "../Data/CollectibleModels/RawCollectible";
import { Fetch } from "./Fetch";

// URLS ENDPOINTS
const endpointPrefix = "WorldCollectionAPI/";

const getAllCollections = "get/collections";
const getAllCollectiblesInCollection = "get/collectibles";
const askIfCollectionExists = "get/exists_collections";

const pushCollectiblesIntoCollection = "post/collectibles"; //POST
const visitation = "update/set_visit"; // PUT
const collectionRename = "update/collection_name"; // PUT
const collectionDelete = "delete/collection"; //DELETE
const collectionsMerge = "update/collection_merge";  // PUT
const collectibleDelete = "delete/collectible"; //DELETE
const collectibleRename = "update/collectible_name"; // PUT
const createCollection = "post/create_collection"; // POST
const collectibleSetIcon = "update/collectible_icon"; // PUT
const setIconForAllCollectiblesInCollection = "/update/collectibles_in_collection_icons"; // PUT
const collectibleSetNotes = "update/collectible_notes"; // PUT

/**
 * Class for sending data to backend WorldCollection API and then retriving data or status from that API.
 */
export class LocalAPIProxy {
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
        return (data['result'] == "1") ? true : false;
    }
    /**
     * Asks WordlCollection API if there exists collection with given name.
     * @param name Name, which we want to check if is already used.
     * @returns True if name is taken.
     */
    public static async existsCollectionWithName(name: string) {
        let data = Fetch.Get(endpointPrefix + askIfCollectionExists,
            {
                'name': name,
            });
        return data.then(this.convertToAskedResult);
    }
    /**
     * Obtains from WordlCollection API all collections.
     * @returns Array of Collections.
     */
    public static async getAllCollections() {
        let data = Fetch.Get(endpointPrefix + getAllCollections, {});
        return data.then(this.convertToListOfCollectionDataModel);
    }
    /**
     * Obtains from WordlCollection API all collectibles, which belong to given collection.
     * @param collectionID Number of collection, from whom we want to obtain collectibles.
     * @returns Array of Collectibles.
     */
    public static async getCollectiblesInCollection(collectionID: Number) {
        let data = Fetch.Get(endpointPrefix + getAllCollectiblesInCollection, {
            'collectionID': collectionID
        });
        return data.then(this.convertToListOfCollectibleDataModel);
    }
    /**
     * Posts visitation of collectible to WordlCollection API.
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
        let data = Fetch.Put(endpointPrefix + visitation,
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
     * Posts collectibles to WordlCollection API, which saves collectibles into given collection.
     * @param collectionID ID Number of collection.
     * @param collectibles Collectibles, which we want to add into collection.
     * @returns Status message, if this process was successful.
     */
    public static async addCollectiblesIntoCollection(collectionID: number, collectibles: RawCollectible[]) {
        let data = Fetch.Post(endpointPrefix + pushCollectiblesIntoCollection,
            {
                'collectibles': collectibles,
                'collectionID': collectionID
            });
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts command to WordlCollection API to create a new collection.
     * @param collectionName Name of the new collection.
     * @returns Status message, if this process was successful.
     */
    public static async postCollectionCreation(collectionName: string) {
        let data = Fetch.Post(endpointPrefix + createCollection,
            {
                'collection_name': collectionName
            });
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts update to WordlCollection API to change collection name.
     * @param updatedCollectionID ID of existed collection.
     * @param newName A new name of collection.
     */
    public static postCollectionUpdateRename(updatedCollectionID: Number, newName: string) {
        return Fetch.Put(endpointPrefix + collectionRename,
            {
                'CollectionID': updatedCollectionID,
                'newName': newName
            }
        );
    }
    /**
     * Posts command to WordlCollection API to delete given collection.
     * Note that, each collectible belonging to this collection will be deleted.
     * @param CollectionID ID of existed collection.
     */
    public static postCollectionUpdateDelete(CollectionID: Number) {
        return Fetch.Delete(endpointPrefix + collectionDelete,
            {
                'CollectionID': CollectionID
            }
        );
    }
    /**
     * Posts commnad to WordlCollection API to merge two collections into one.
     * Each collectible from collection will be updated to belong to a new collection.
     * @param CollectionID ID of collection, which will be merged into other.
     * @param newCollectionID ID of collection, into which collectibles will be moved.
     */
    public static postCollectionUpdateMerge(CollectionID: Number, newCollectionID: Number) {
        return Fetch.Put(endpointPrefix + collectionsMerge,
            {
                'CollectionID': CollectionID,
                'NewCollectionID': newCollectionID
            }
        );
    }
    /**
     * Posts command to WordlCollection API to delete given collectible from the collection.
     * @param collectibleQNumber QNUmber of collectible, which will be deleted.
     * @param CollectionID ID of collection, in which collectible resides.
     */
    public static postCollectibleDeletion(collectibleQNumber: string, CollectionID: Number) {
        return Fetch.Delete(endpointPrefix + collectibleDelete,
            {
                'q_number': collectibleQNumber,
                'CollectionID': CollectionID
            }
        )
    }
    /**
     * Posts command to WordlCollection API to change name of given collectible.
     * @param collectibleQNumber QNUmber of collectible, which name will be updated.
     * @param newName A new name of collectible.
     */
    public static postCollectibleUpdateName(collectibleQNumber: string, newName: string) {
        return Fetch.Put(endpointPrefix + collectibleRename,
            {
                'q_number': collectibleQNumber,
                'name': newName
            }
        )
    }
    /**
     * Posts command to WordlCollection API to change icon of given collectible.
     * @param collectibleQNumber QNumber of collectible, whose icon will be changed.
     * @param icon Name of icon, which is used for rendering.
     * @returns Status message, if this process was successful.
     */
    public static async postCollectibleUpdateIcon(collectibleQNumber: string, icon: string) {
        let data = Fetch.Put(endpointPrefix + collectibleSetIcon,
            {
                'q_number': collectibleQNumber,
                'icon': icon
            }
        )
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts command to WordlCollection API to change icon for all collectibles in given collection.
     * @param collectionID ID of collection.
     * @param icon Name of icon, which is used for rendering.
     * @returns  Status message, if this process was successful.
     */
    public static async postCollectiblesInCollectionUpdateIcon(collectionID: number, icon: string) {
        let data = Fetch.Put(endpointPrefix + setIconForAllCollectiblesInCollection,
            {
                'collectionID': collectionID,
                'icon': icon
            }
        )
        return this.convertToStatusMSG(data);
    }
    /**
     * Posts command to WordlCollection API to change notes for given collectible.
     * @param collectibleQNumber QNUmber of collectible, whose notes will be updated.
     * @param notes Information, which user want to save to collectible.
     * @returns  Status message, if this process was successful.
     */
    public static async postCollectibleUpdateNotes(collectibleQNumber: string, notes: string | null) {
        let data = Fetch.Put(endpointPrefix + collectibleSetNotes,
            {
                'q_number': collectibleQNumber,
                'notes': notes
            }
        )
        return this.convertToStatusMSG(data);
    }

}