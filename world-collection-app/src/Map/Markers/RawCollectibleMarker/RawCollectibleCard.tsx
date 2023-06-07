import { useEffect, useState } from "react";
import { WikiDataAPIProxy } from "../../../API/WikiDataAPIProxy";
import { CollectibleBasicInfo } from "../../../Data/CollectibleModels/CollectibleBasicInfo";
import "../Marker.css"
import LoadingStatus from "../../../Gadgets/LoadingStatus";
import CollectibleDetails from "../../../CollectibleDetails/CollectibleDetails";
import { RawCollectible } from "../../../Data/CollectibleModels/RawCollectible";

/**
 * Props necessary for RawCollectibleCard.
 */
export interface RawCollectibleCardProps {
    /**Raw collectible, which data will be displayed in the card. */
    rawCollectible: RawCollectible;
}
/**
 * Func rendering raw collectible card.
 * It fetches basic info of raw collectible (image, desciption).
 * It contains mechanism for fecthing and showing raw collectible details.
 * @param RawCollectibleCardProps See RawCollectibleCardProps description.
 * @returns JSX element rendering raw collectible info card.
 */
function RawCollectibleCard({ rawCollectible }: RawCollectibleCardProps) {
    const [showingDetails, setShowingDetails] = useState(false);
    const [basicInfo, setBasicInfo] = useState<CollectibleBasicInfo>(new CollectibleBasicInfo());
    const [loadingBasicInfo, setLoadingBasicInfo] = useState(false);
    const [errorBasicInfo, setErrorBasicInfo] = useState(false);

    const handleShowingDetails = () => {
        setShowingDetails((prev) => !prev);
    }

    // when it is mounted (the first time rendered) it will fetch image and description
    useEffect(() => {
        /**
        * Fetches image and description of raw collectible.
        */
        const fetchCollectibleBasicInfo = () => {
            setErrorBasicInfo(false);
            setLoadingBasicInfo(true);
            WikiDataAPIProxy.getCollectibleBasicInfo(rawCollectible.QNumber).then((data) => {
                setLoadingBasicInfo(false);
                setBasicInfo(data);
            }).catch(() => {
                setErrorBasicInfo(true);
            })
        }
        fetchCollectibleBasicInfo()
    }, [rawCollectible])

    return (
        <>
            <div className="scroll">
                {loadingBasicInfo && (
                    <div className="d-flex justify-content-center">
                        <LoadingStatus error={errorBasicInfo} errorText={"Something went wrong, try reload"} loadingText={"Loading info"} />
                    </div>
                )}
                {!loadingBasicInfo && (
                    <>
                        <div className="card">
                            {basicInfo.imageURL != null && (
                                <img src={basicInfo.imageURL} className="card-img-top" alt={"image of " + rawCollectible.name} />
                            )}
                            <div className="card-body">
                                <h4 className="card-title">{rawCollectible.name}</h4>
                                <p className="card-text">{(basicInfo.description != null) ? basicInfo.description : ""}</p>
                                <p className="text-muted">{rawCollectible.name} is type of:</p>
                                <div className="d-flex flex-wrap">
                                    {rawCollectible.instanceOF.map((t, index) => {
                                        return (
                                            <span key={index} className="badge bg-info text-dark">{t}</span>
                                        )
                                    })}
                                </div>

                                <div className="d-flex flex-column">
                                    <button type='button' className="btn btn-light" onClick={handleShowingDetails}>{(!showingDetails) ? "Show details" : "Close"}</button>
                                </div>

                                {showingDetails && (
                                    <>
                                        <h5>Details</h5>
                                        <CollectibleDetails QNumberOfCollectible={rawCollectible.QNumber} />
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default RawCollectibleCard;