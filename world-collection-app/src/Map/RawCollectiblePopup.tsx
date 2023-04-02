import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { WikiDataAPI } from "../API/WikiDataAPI";
import { CollectibleBasicInfo } from "../Data/CollectibleBasicInfo";

import "./CollectibleMarker.css"
import LoadingStatus from "../Gadgets/LoadingStatus";

import CollectibleDetails from "../Details/CollectibleDetails";
import { RawCollectible } from "../Data/RawCollectible";

export interface RawCollectiblePopupProps{
    rawCollectible : RawCollectible;
}

function RawCollectiblePopup({rawCollectible} : RawCollectiblePopupProps){

    const [showingDetails,setShowingDetails] = useState(false);

    const [basicInfo,setBasicInfo] = useState<CollectibleBasicInfo>(new CollectibleBasicInfo());
    const [loadingBasicInfo,setLoadingBasicInfo] = useState(false);
    const [errorBasicInfo,setErrorBasicInfo] = useState(false);

    const handleShowingDetails = () => {
        setShowingDetails((prev) => !prev);
    }
    
    const fetchCollectibleBasicInfo = () => {
        setErrorBasicInfo(false);
        setLoadingBasicInfo(true);
        WikiDataAPI.getCollectibleBasicInfo(rawCollectible.QNumber).then((data) => {
            setLoadingBasicInfo(false);
            setBasicInfo(data);
        }).catch(() => {
            setErrorBasicInfo(true);
        })
    }
    
    useEffect(() => {
        fetchCollectibleBasicInfo()
    },[,rawCollectible])
    
    return (
        <>
            <Popup>
                    <div className="scroll">
                        {loadingBasicInfo && (
                            <div className="d-flex justify-content-center">
                                <LoadingStatus error={errorBasicInfo} errorText={"Something went wrong, try reload"} loadingText={"Loading info"} />
                            </div>
                        )}
                        {!loadingBasicInfo && (
                            <>
                                <div className="card">
                                    {basicInfo.image != null && (
                                        <img src={basicInfo.image} className="card-img-top" alt={"image of " + rawCollectible.name}/>
                                    )}
                                    <div className="card-body">
                                        <h4 className="card-title">{rawCollectible.name}</h4>
                                        <p className="card-text">{basicInfo.desc}</p>
                                        <p className="text-muted">{rawCollectible.name} is type of:</p>
                                        <div className="d-flex flex-wrap">
                                            {rawCollectible.subTypeOf.split('/').map((t,index) => {
                                                return(
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
                                                <CollectibleDetails collectibleQNumber={rawCollectible.QNumber} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Popup>
        </>
    )
}

export default RawCollectiblePopup;