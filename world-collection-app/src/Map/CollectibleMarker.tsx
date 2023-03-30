import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { WikiDataAPI } from "../API/WikiDataAPI";
import { CollectibleBasicInfo } from "../Data/CollectibleBasicInfo";
import { Collectible } from "../Data/Database/Collectible";
import { GetIcon } from "./GetIcon";
import './Card.css'
import "./CollectibleMarker.css"
import LoadingStatus from "../Gadgets/LoadingStatus";
import Visitation from "../CollectibleEditationComponents/Visitation";

export interface CollectibleMarkerProps{
    collectible : Collectible;
}

function CollectibleMarker({collectible} : CollectibleMarkerProps){
    const [icon,setIcon] = useState(collectible.icon);
    const [isVisit,setIsVisit] = useState(collectible.isVisit);

    const [editingVisitation,setEditingVisitation] = useState(false);

    const [basicInfo,setBasicInfo] = useState<CollectibleBasicInfo>(new CollectibleBasicInfo());
    const [loadingBasicInfo,setLoadingBasicInfo] = useState(false);
    const [errorBasicInfo,setErrorBasicInfo] = useState(false);

    const handleEditing = () => {
        setEditingVisitation((prev) => !prev);
    }

    const handleIconChange = (icon : string) => {
        setIcon(icon);
    }
    const handleVisitationChange = (isVisit : boolean) => {
        setIsVisit(isVisit);
    }
    const fetchCollectibleBasicInfo = () => {
        setErrorBasicInfo(false);
        setLoadingBasicInfo(true);
        WikiDataAPI.getCollectibleBasicInfo(collectible.QNumber).then((data) => {
            setLoadingBasicInfo(false);
            setBasicInfo(data);
        }).catch(() => {
            setErrorBasicInfo(true);
        })
    }
    const renderDate = () => {
        
        if (collectible.isVisit && collectible.dateFrom != null){
            
            if(collectible.dateTo == null){
                return (<h6>{collectible.dateFrom.ToString()}</h6>);
            }else{
                return (<h6>{collectible.dateFrom.ToString()} - {collectible.dateTo.ToString()}</h6>)
            }
        }
        return (<></>)
    }
    useEffect(() => {
        fetchCollectibleBasicInfo()
    },[])
    return (
        <>
            <Marker 
                position={[collectible.lati,collectible.long]}
                icon={GetIcon(icon,isVisit)}>
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
                                        <img src={basicInfo.image} className="card-img-top" alt={"image of " + collectible.name}/>
                                    )}
                                    <div className="card-body">
                                        <h4 className="card-title">{collectible.name}</h4>
                                        <p className="card-text">{basicInfo.desc}</p>
                                        <p className="text-muted">{collectible.name} is type of:</p>
                                        <div className="d-flex flex-wrap">
                                            {collectible.type.split('/').map((t,index) => {
                                                return(
                                                    <span key={index} className="badge bg-info text-dark">{t}</span>
                                                )
                                            })}
                                        </div>
                                        <p className="text-muted">Visit status</p>
                                        {isVisit ? (
                                            <span className="badge bg-success"><h5>Visited</h5></span>
                                        ) : (
                                            <span className="badge bg-danger"><h5>Not visited yet</h5></span>
                                        )}
                                        {renderDate()}
                                        <h5 className="text-muted">Actions</h5>
                                        <p className="text-muted">Here you can edit, visitation, icon image and see more details.</p>
                                        <div className="d-flex flex-row">
                                            <button type='button' className="btn btn-primary" onClick={handleEditing}>{(!editingVisitation) ? "Visitation" : "Close"}</button>
                                        </div>

                                        
                                        {editingVisitation && (
                                                <>
                                                    <h5>Editing Visitation</h5>
                                                    <Visitation collectible={collectible} updateVisitation={handleVisitationChange}/>
                                                </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Popup>
            </Marker>
        </>
    )
}

export default CollectibleMarker;