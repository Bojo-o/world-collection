import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { WikiDataAPI } from "../API/WikiDataAPI";
import { CollectibleBasicInfo } from "../Data/CollectibleBasicInfo";
import { Collectible } from "../Data/Database/Collectible";
import { GetIcon } from "./GetIcon";

import "./CollectibleMarker.css"
import LoadingStatus from "../Gadgets/LoadingStatus";
import Visitation from "../CollectibleEditationComponents/Visitation";
import { CustomDate } from "../Data/CustomDate";
import IconsSelector from "../ImageIcons/IconsSelector";
import Notes from "../CollectibleEditationComponents/Notes";

export interface CollectibleMarkerProps{
    collectible : Collectible;
}

function CollectibleMarker({collectible} : CollectibleMarkerProps){
    const [icon,setIcon] = useState(collectible.icon);
    const [isVisit,setIsVisit] = useState(collectible.isVisit);
    const [dateFrom,setDateFrom] = useState(collectible.dateFrom);
    const [dateTo,setDateTo] = useState(collectible.dateTo);
    

    const [editingVisitation,setEditingVisitation] = useState(false);
    const [editingIcon,setEditingIcon] = useState(false);
    const [editingNotes,setEditingNotes] = useState(false);

    const [basicInfo,setBasicInfo] = useState<CollectibleBasicInfo>(new CollectibleBasicInfo());
    const [loadingBasicInfo,setLoadingBasicInfo] = useState(false);
    const [errorBasicInfo,setErrorBasicInfo] = useState(false);

    const handleEditingVisitation = () => {
        setEditingVisitation((prev) => !prev);
    }
    const handleEditingIcon = () => {
        setEditingIcon((prev) => !prev);
    }
    const handleEditingNotes = () => {
        setEditingNotes((prev) => !prev);
    }

    const handleIconChange = (icon : string) => {
        setIcon(icon);
    }
    const handleNotesChange = (notes : string) => {
        collectible.notes = notes;
    }
    const handleVisitationChange = (isVisit : boolean,dateFrom : CustomDate|null,dateTo : CustomDate|null) => {
        setIsVisit(isVisit);
        setDateFrom(dateFrom);
        setDateTo(dateTo);
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
        
        if (isVisit && dateFrom != null){
            
            if(dateTo == null){
                return (<h5>{dateFrom.ToString()}</h5>);
            }else{
                return (<h5>{dateFrom.ToString()} - {dateTo.ToString()}</h5>)
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
                                        <h5 className="text-muted">Visit status</h5>
                                        {isVisit ? (
                                            <span className="badge bg-success"><h5>Visited</h5></span>
                                        ) : (
                                            <span className="badge bg-danger"><h5>Not visited yet</h5></span>
                                        )}
                                        {renderDate()}
                                        <h5 className="text-muted">Notes</h5>
                                            <p>{collectible.notes}</p>
                                        <h5 className="text-muted">Actions</h5>
                                        <p className="text-muted">Here you can edit, visitation, icon image and see more details.</p>
                                        <div className="d-flex flex-column">
                                            <button type='button' className="btn btn-success" onClick={handleEditingVisitation}>{(!editingVisitation) ? "Visitation" : "Close"}</button>
                                            <button type='button' className="btn btn-warning" onClick={handleEditingIcon}>{(!editingIcon) ? "Edit Icon" : "Close"}</button>
                                            <button type='button' className="btn btn-info" onClick={handleEditingNotes}>{(!editingNotes) ? "Edit notes" : "Close"}</button>
                                        </div>

                                        
                                        {editingVisitation && (
                                                <>
                                                    <h5>Editing Visitation</h5>
                                                    <Visitation collectible={collectible} updateVisitation={handleVisitationChange}/>
                                                </>
                                        )}
                                        {editingIcon && (
                                                <>
                                                    <h5>Editing Icon</h5>
                                                    <IconsSelector collectible={collectible} handleChangeOfIcon={handleIconChange}/>
                                                </>
                                        )}

                                        {editingNotes && (
                                            <>
                                                <h5>Editing Notes</h5>
                                                <Notes collectible={collectible} updateNotes={handleNotesChange}/>
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