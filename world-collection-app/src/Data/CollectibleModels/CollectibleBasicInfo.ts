/**
 * Data model representing basic info of collectible.
 * It contains description and image URL.
 * Attributes are optional, that means not every collectible has image or description.
 */
export class CollectibleBasicInfo {
    imageURL: string | null = null
    description: string | null = null

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.image) this.imageURL = initializer.image;
        if (initializer.desc) this.description = initializer.desc;
    }
}