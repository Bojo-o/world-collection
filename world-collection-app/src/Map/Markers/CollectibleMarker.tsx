import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { WikiDataAPI } from "../../API/WikiDataAPI";
import { CollectibleBasicInfo } from "../../Data/CollectibleModels/CollectibleBasicInfo";
import { Collectible } from "../../Data/DatabaseModels/Collectible";
import { getIcon } from "../MapFunc/GetIcon";
import "./Marker.css"
import LoadingStatus from "../../Gadgets/LoadingStatus";
import Visitation from "../../CollectibleEditableComponents/Visitation/Visitation";
import { DateWithPrecision } from "../../Data/TimeModels/DateWithPrecision";
import IconsSelector from "../../CollectibleEditableComponents/Icons/IconsSelector";
import NotesEditation from "../../CollectibleEditableComponents/Notes/NotesEditation";
import CollectibleDetails from "../../CollectibleDetails/CollectibleDetails";
import { DatabaseAPI } from "../../API/DatabaseAPI";

/**
 * Props neccesary for CollectibleMarker.
 */
export interface CollectibleMarkerProps{
    /** Collectible data model containing data about collectible, for which it renders marker and card when marker was clicked on by user*/
    collectible : Collectible;
}
/**
 * Func rendering collectible marker into map.
 * Each Collectible marker has own marker icon image, which is obtained from collectible data model.
 * If icon image contains in className "gray" then icon will be rendered only white and black.
 * "gray" in className is obtained by calling func, which gets icon from collectible data model (if collectible has not yet been visited, then icon will contains
 * "gray" in className).
 * When marker is clicked by user, it will render collectible "card". That card contains data about collectible such as:
 * image, name , description of collectible (image and description are fetched from API),
 * date of visit,
 * notes.
 * Also it contains action part where user can make some action like edditing visitaiton, notes, select icon of collectible and to see details of collectible.
 * That will fetch collectible details from API.
 * 
 * @param CollectibleMarkerProps See CollectibleMarkerProps description.
 * @returns JSX element rendering collectible marker, which if was clicked by user it also will render collectible card.
 */
function CollectibleMarker({collectible} : CollectibleMarkerProps){
    // icon
    const [icon,setIcon] = useState(collectible.icon);
    const [editingIcon,setEditingIcon] = useState(false);
    // visitation
    const [wasCollectibleVisited,setwasCollectibleVisited] = useState(collectible.isVisit);
    const [dateOfVisitFrom,setDateOfVisitFrom] = useState(collectible.dateFrom);
    const [dateOfVisitTo,setDateOfVisitTo] = useState(collectible.dateTo);
    const [editingVisitation,setEditingVisitation] = useState(false);
    // notes
    const [editingNotes,setEditingNotes] = useState(false);
    // details
    const [showingDetails,setShowingDetails] = useState(false);
    // basic info - image, description of collectible
    const [basicInfoOfCollectible,setBasicInfoOfCollectible] = useState<CollectibleBasicInfo>(new CollectibleBasicInfo());
    const [loadingBasicInfo,setLoadingBasicInfo] = useState(false);
    const [errorBasicInfo,setErrorBasicInfo] = useState(false);

    const handleEditingVisitation = () => {
        setEditingVisitation((prev) => !prev);
    }
    const handleEditingIcon = () => {
        setEditingIcon((prev) => !prev);
    }
    const handleShowingDetails = () => {
        setShowingDetails((prev) => !prev);
    }
    const handleEditingNotes = () => {
        setEditingNotes((prev) => !prev);
    }
    const handleIconChange = (icon : string) => {
        setIcon(icon);
    }
    const handleNotesChange = (notes : string|null) => {
        collectible.notes = notes;
    }

    const handleVisitationChange = (isVisit : boolean,dateFrom : DateWithPrecision|null,dateTo : DateWithPrecision|null) => {
        setwasCollectibleVisited(isVisit);
        setDateOfVisitFrom(dateFrom);
        setDateOfVisitTo(dateTo);
    }
    /**
     * Fetches image and description of collectible.
     */
    const fetchCollectibleBasicInfo = () => {
        setErrorBasicInfo(false);
        setLoadingBasicInfo(true);
        WikiDataAPI.getCollectibleBasicInfo(collectible.QNumber).then((data) => {
            setLoadingBasicInfo(false);
            setBasicInfoOfCollectible(data);
        }).catch(() => {
            setErrorBasicInfo(true);
        })
    }
    /** Save a new icon by invoking the right DatabaseAPI method. */
    const saveIcon = (settedIcon : string) => {
        return  DatabaseAPI.postCollectibleUpdateIcon(collectible.QNumber,settedIcon);
    }

    const renderDateOfVisit = () => {
        if (wasCollectibleVisited && dateOfVisitFrom != null){
            if(dateOfVisitTo == null){
                return (<h5>{dateOfVisitFrom.ToString()}</h5>);
            }else{
                return (<h5>{dateOfVisitFrom.ToString()} - {dateOfVisitTo.ToString()}</h5>)
            }
        }
        return (<></>)
    }
    // when component mount meaning it is the first called, it invokes func fetching collecible basic data
    useEffect(() => {
        fetchCollectibleBasicInfo()
    },[])

    return (
        <>
            <Marker 
                position={[collectible.latitude,collectible.longitude]}
                icon={getIcon(icon,wasCollectibleVisited)}>
                <Popup>
                    <div className="scroll">
                        {loadingBasicInfo && (
                            <div className="d-flex justify-content-center">
                                <LoadingStatus error={errorBasicInfo} errorText={"Something went wrong, try reload"} loadingText={"Loading info"} />
                            </div>
                        )}
                        {!loadingBasicInfo && (
                            <>
                                <div className="card card-collectibles">
                                    {basicInfoOfCollectible.imageURL != null && (
                                        <img src={basicInfoOfCollectible.imageURL} className="card-img-top" alt={"image of " + collectible.name}/>
                                    )}
                                    <div className="card-body">
                                        <h4 className="card-title">{collectible.name}</h4>
                                        <p className="card-text">{(basicInfoOfCollectible.description != null) ? basicInfoOfCollectible.description : ""}</p>
                                        <p className="text-muted">{collectible.name} is type of:</p>
                                        <div className="d-flex flex-wrap">
                                            {collectible.instanceOf.map((t,index) => {
                                                return(
                                                    <span key={index} className="badge bg-info text-dark">{t}</span>
                                                )
                                            })}
                                        </div>
                                        <h5 className="text-muted">Visit status</h5>
                                        {wasCollectibleVisited ? (
                                            <span className="badge bg-success"><h5>Visited</h5></span>
                                        ) : (
                                            <span className="badge bg-danger"><h5>Not visited yet</h5></span>
                                        )}
                                        {renderDateOfVisit()}
                                        <h5 className="text-muted">Notes</h5>
                                            <p>{collectible.notes}</p>
                                        <h5 className="text-muted">Actions</h5>
                                        <p className="text-muted">Here you can edit, visitation, icon image and see more details.</p>
                                        <div className="d-flex flex-column">
                                            <button type='button' className="btn btn-light" onClick={handleShowingDetails}>{(!showingDetails) ? "Show details" : "Close"}</button>
                                            <button type='button' className="btn btn-success" onClick={handleEditingVisitation}>{(!editingVisitation) ? "Visitation" : "Close"}</button>
                                            <button type='button' className="btn btn-warning" onClick={handleEditingIcon}>{(!editingIcon) ? "Edit Icon" : "Close"}</button>
                                            <button type='button' className="btn btn-info" onClick={handleEditingNotes}>{(!editingNotes) ? "Edit notes" : "Close"}</button>
                                        </div>

                                        {showingDetails && (
                                            <>
                                                <h5>Details</h5>
                                                <CollectibleDetails QNumberOfCollectible={collectible.QNumber} />
                                            </>
                                        )}
                                        {editingVisitation && (
                                                <>
                                                    <h5>Editing Visitation</h5>
                                                    <Visitation collectible={collectible} updateVisitation={handleVisitationChange}/>
                                                </>
                                        )}
                                        {editingIcon && (
                                                <>
                                                    <h5>Editing Icon</h5>
                                                    <IconsSelector  handleChangeOfIcon={handleIconChange} saveIconChange={saveIcon}/>
                                                </>
                                        )}

                                        {editingNotes && (
                                            <>
                                                <h5>Editing Notes</h5>
                                                <NotesEditation collectible={collectible} updateNotes={handleNotesChange}/>
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