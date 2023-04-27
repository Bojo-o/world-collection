export interface IWikibaseItemPropertyData {
    QNumber: string,
    name: string,
    relationQNumber: string,
    relation: string
}
/**
 * Data model representing WikibaseItemPropertyData.
 */
export class WikibaseItemPropertyData {
    /** Identificator of property. Here it denotes as QNumber (for convention), but Wikidata it denotes as PNumber (property number).*/
    QNumber: string;
    /** Name of property. */
    name: string;
    /** QNumber of relation. */
    relationQNumber: string;
    /** Relation in human form. For example "instance or subclass of"*/
    relation: string;

    constructor({ QNumber, name, relationQNumber, relation }: IWikibaseItemPropertyData) {
        this.QNumber = QNumber;
        this.name = name;
        this.relationQNumber = relationQNumber;
        this.relation = relation;
    }

}