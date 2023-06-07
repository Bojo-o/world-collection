import { useEffect, useState } from "react";
import { WikiDataAPIProxy } from "../../API/WikiDataAPIProxy";
import { RawCollectible } from "../../Data/CollectibleModels/RawCollectible";
import FoundResultsHandler from "../../DataSearching/FoundResultsHandler";
import { CollectiblesSearchQueryData } from "../../Data/CollectibleSearching/ColectiblesSearchQueryData";

/**
 * Props necessary for CollectiblePresenter component.
 */
export interface CollectiblesPresenterProps {
    /**
     * Data neccesary for WikibaseAPI to search for collectibles.
     */
    dataForWikibaseAPI: CollectiblesSearchQueryData;
}

/**
 * Func which fetches raw collectibles from WikidataAPI and then provides them to component, which renders that data.
 * @param CollectiblesPresenterProps See CollectiblesPresenterProps description.
 * @returns JSX element rendering UI for managing found collectibles.
 */
function CollectiblesPresenter({ dataForWikibaseAPI }: CollectiblesPresenterProps) {
    const [collectibles, setCollectibles] = useState<RawCollectible[] | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        WikiDataAPIProxy.searchForCollectibles(dataForWikibaseAPI).then((data) => {
            setLoading(false)
            setCollectibles(data);
        }).catch(() =>
            setError(true)
        )
    }, [dataForWikibaseAPI])
    return (
        <>

            <div>
                <h1>Collectibles </h1>
                {loading && (
                    <>
                        {error ? (
                            <>
                                <h3>Some error occurs, try later, or try query with less parameters</h3>
                            </>
                        ) : (
                            <>
                                <div className="d-flex flex-row">
                                    <h3>Searching for collectibles</h3>
                                    <div className="spinner-border text-info" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {!loading && collectibles != null && (
                    <>
                        <FoundResultsHandler results={collectibles} />
                    </>
                )}
            </div>

        </>
    )
}

export default CollectiblesPresenter;