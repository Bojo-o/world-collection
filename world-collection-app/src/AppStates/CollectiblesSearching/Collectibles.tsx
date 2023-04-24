import { useEffect, useState } from "react";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import { RawCollectible } from "../../Data/CollectibleModels/RawCollectible";
import Result from "../../DataSearching/Results";
import { CollectiblesSearchQueryData } from "./ColectiblesSearchQueryData";

export interface CollectiblesProps{
    queryData : CollectiblesSearchQueryData;
}

function Collectibles({queryData} : CollectiblesProps){
    const [collectibles,setCollectibles]  = useState<RawCollectible[]|null>(null);

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        WikiDataAPI.searchForCollectibles(queryData).then((data) => {
            setLoading(false)
            setCollectibles(data);
        }).catch(() =>
            setError(true)
        )
    },[])
    return(
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
                
                    {!loading && collectibles != null &&(
                        <>
                            <Result data={collectibles}/>
                        </>
                    )}
                </div>
            
        </>
    )
}

export default Collectibles;