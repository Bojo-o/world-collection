import { useState } from "react";
import { Collectible } from "../../Data/DatabaseModels/Collectible";
import { DatabaseAPI } from "../../API/DatabaseAPI";
import LoadingStatus from "../../Gadgets/LoadingStatus";
import './NotesEditation.css';

/**
 * Props necessary for NotesEditation.
 */
export interface NotesEditationProps {
    /** Collectible, which notes will be edited. */
    collectible: Collectible;
    /**
     * Func which invokes parent component to handle changes notes.
     * @param editedNotes edited notes of collectible.
     */
    updateNotes: (editedNotes: string | null) => void;
}
/**
 * Renders collectible`s notes, which can be edited.
 * @param NotesEditationProps See NotesEditationProps description. 
 * @returns JSX element rendering collectible`s notes editation.
 */
function NotesEditation({ collectible, updateNotes }: NotesEditationProps) {
    const [notes, setNotes] = useState<string | null>(collectible.notes);
    const [saving, setSaving] = useState(false);
    const [savingError, setSavingError] = useState(false);
    const [savingStatus, setSavingStatus] = useState<string | null>(null)

    const handleChange = (e: any) => {
        setNotes(e.target.value);
    }
    /** Saves notes, it call DatabaseAPI to save notes. */
    const saveNotes = () => {
        setSaving(true);
        setSavingError(false);
        setSavingStatus(null);
        DatabaseAPI.postCollectibleUpdateNotes(collectible.QNumber, notes).then((status) => {
            setSaving(false);
            setSavingStatus(status);
            updateNotes(notes);
        }).catch(() => {
            setSavingError(true);
        })
    }
    return (
        <div className="d-flex flex-column">
            <div className="form-floating">
                <textarea className="form-control" placeholder="Make some notes" id="notesTextArea" value={(notes == null) ? "" : notes} maxLength={1024} onChange={handleChange}></textarea>
                <label htmlFor="notesTextArea">Collectible notes</label>
            </div>
            <br />
            {saving && (
                <>
                    <LoadingStatus error={savingError} errorText={"Something went wrong, try again"} loadingText={"Saving notes"} />
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
export default NotesEditation;