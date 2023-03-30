import { useState } from "react";
import { Collectible } from "../Data/Database/Collectible";
import { DatabaseAPI } from "../DatabaseGateway/DatabaseAPI";
import LoadingStatus from "../Gadgets/LoadingStatus";
import './Notes.css';

export interface NotesProps{
    collectible : Collectible;
    updateNotes : (notes : string) => void;
}
function Notes({collectible,updateNotes} : NotesProps){
    const [notes,setNotes] = useState(collectible.notes);
    const [saving,setSaving] = useState(false);
    const [savingError,setSavingError] = useState(false);
    const [savingStatus,setSavingStatus] = useState<string|null>(null)

    const handleChange = (e : any) => {
        setNotes(e.target.value);
    }
    const saveNotes = () => {
        setSaving(true);
        setSavingError(false);
        setSavingStatus(null);
        DatabaseAPI.postCollectibleUpdateNotes(collectible.QNumber,notes).then((status) => {
            setSaving(false);
            setSavingStatus(status);
            updateNotes(notes);
        }).catch(() => {
            setSavingError(true);
        })
    }
    return(
        <div className="d-flex flex-column">
            <div className="form-floating">
                <textarea className="form-control" placeholder="Make some notes" id="notesTextArea" value={notes} maxLength={1024} onChange={handleChange}></textarea>
                <label htmlFor="notesTextArea">Collectible notes</label>
            </div>
            <br/>
            {saving && (
                    <>
                        <LoadingStatus error={savingError} errorText={"Something went wrong, try again"} loadingText={"Saving notes"}/>
                    </>
            )}
            {savingStatus != null && (
                <>
                    <div className="d-flex justify-content-center">
                        <h5>{savingStatus}</h5>
                    </div>
                </>
            )}
            {notes == collectible.notes ? (
                <>
                    <button type="button" className="btn btn-success" disabled>Save notes</button>
                </>
            ) : (
                <>
                    <button type="button" className="btn btn-success" onClick={saveNotes}>Save notes</button>
                </>
            )}
        </div>
    )
}
export default Notes;