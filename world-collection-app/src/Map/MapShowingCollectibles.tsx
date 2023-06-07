import React from 'react';
import { Collectible } from '../Data/DatabaseModels/Collectible';
import CollectibleMarker from './Markers/CollectibleMarker';
import { extractFromObjectCoordinateData } from './MapFunc/ExtractCoordinates';
import MapBoundsOption from './MapOptions/MapBoundsOption';
import MapWrapper from './MapWrapper';

/** Props necessary needing for MapShowingCollectibles */
export interface MapShowingCollectiblesProps {
    /**Array of collectibes, which will be showed on the map. */
    collectiblesToShow: Collectible[]
}
/**
 * Func for rendering interative map, which contains markers with collectible cards.
 * @param MapShowingCollectiblesProps See MapShowingCollectiblesProps description.
 * @returns JSX elemnt rendering map, which contains markers with collectibles
 */
function MapShowingCollectibles({ collectiblesToShow }: MapShowingCollectiblesProps) {
    
    return (
        <>
            <MapWrapper mapContainerBody={() => {
                return (<>
                    {
                        collectiblesToShow.map((collectible, index) => {
                            
                            return (<CollectibleMarker key={index} collectible={collectible} />)
                        })
                    }

                    <MapBoundsOption waypoints={extractFromObjectCoordinateData(collectiblesToShow)} />
                </>)
            }} />

        </>
    );
}

export default MapShowingCollectibles;