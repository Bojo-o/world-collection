import React from "react";
import { RawCollectible } from "../Data/CollectibleModels/RawCollectible";
import RawCollectibleMarker from "./Markers/RawCollectibleMarker/RawCollectibleMarker";
import MapBoundsOption from "./MapOptions/MapBoundsOption";
import { extractFromObjectCoordinateData } from "./MapFunc/ExtractCoordinates";
import MapWrapper from "./MapWrapper";

/** Props necessary needing for MapShowingRawCollectibles */
export interface MapShowingRawCollectiblesProps {
    /**Array of raw collectibes, which will be showed on the map. */
    rawCollectiblesToShow: RawCollectible[];
    // next attributes are needed to RawCollectibleMarker, so they only travel across this func.
    edited: RawCollectible | null;
    removeItem: (item: RawCollectible) => void;
    editItem: (item: RawCollectible) => void;
    cancel: () => void;
    saveItem: (item: RawCollectible) => void;
    handleNameChange: (event: any) => void;
}
/**
 * Func for rendering interative map, which contains markers with raw collectible cards.
 * @param MapShowingRawCollectiblesProps See MapShowingRawCollectiblesProps description.
 * @returns JSX elemnt rendering map, which contains markers with raw collectibles.
 */
function MapShowingRawCollectibles({ rawCollectiblesToShow: markers, edited, removeItem, editItem, cancel, saveItem, handleNameChange: handleChange }: MapShowingRawCollectiblesProps) {

    return (
        <>
            <MapWrapper mapContainerBody={() => {
                return (
                    <>
                        {markers.map((waypoint, index) => {
                            return <RawCollectibleMarker key={index} rawCollectible={waypoint} removeItem={removeItem} edited={edited} editItem={editItem} cancelItem={cancel} saveItem={saveItem} handleNameChange={handleChange} />
                        })}

                        <MapBoundsOption waypoints={extractFromObjectCoordinateData(markers)} />
                    </>
                )
            }} />
        </>
    );
}

export default MapShowingRawCollectibles;