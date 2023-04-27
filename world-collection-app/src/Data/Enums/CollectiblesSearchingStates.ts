/**
 * Enums with states of collectible searching process.
 * Each reporesents one of state of that process.
 */
export enum CollectiblesSearchingStates{
    // select super class, which describes what colelctibles the user wants to search for
    TypeChoosing,
    // choose area restriciton
    AreaChoosing,
    // define area, in which collectibles have to locate
    RadiusArea,
    AdministrativeArea,
    RegionArea,
    // applie some filters
    FiltersSelection,
    // view found collectibles
    Collectibles
}