import { useEffect, useState } from "react";
import data from '../../Data/icons.json'
import LoadingStatus from "../../Gadgets/LoadingStatus";
import './IconsSelector.css'

/**
 * Props necessary for IconsSelector.
 */
export interface IconsSelectorProps{
    /**
     * Func handling and propagating change of icon for above component.
     * @param nameOfIcon Name of icon.
     */
    handleChangeOfIcon : (nameOfIcon : string) => void;
    /** Func for saving icon. 
     * @param nameOfIcon Name of icon.
    */
    saveIconChange : (nameOfIcon : string) =>  Promise<string>;
}
/**
 * Renders list of icons, which can be setted as collectible marker icon.
 * It contains mechanism for clicking and then handling change of icon.
 * @param IconsSelectorProps See IconsSelectorProps descriptions.
 * @returns JSX element rendering icons, on which can the user click.
 */
function IconsSelector({handleChangeOfIcon,saveIconChange} : IconsSelectorProps){
    const [listOfIcons,setListOfIcons] = useState<string[]>([]);
    const [saving,setSaving] = useState(false);
    const [savingError,setSavingError] = useState(false);
    const [savingStatus,setSavingStatus] = useState<string|null>(null)

    const handleIconChange = (icon : string) => {
        setSaving(true);
        setSavingError(false);
        setSavingStatus(null);
        saveIconChange(icon).then((status) => {
            setSaving(false);
            setSavingStatus(status);
            handleChangeOfIcon(icon);
        }).catch(() => {
            setSavingError(true);
        })
    }
    useEffect(() => {
        setListOfIcons(data.icons)
    },[])
    return (
        <div>
            <div className="d-flex flex column">
                <div className="d-flex flex-wrap">
                    {listOfIcons.map((icon,index) => {
                        return (
                            <>
                                <div key={index} className="">
                                    <img  onClick={() => handleIconChange(icon)} src={ require('../../static/Icons/' + icon + '.png')} className="img-thumbnail icon" alt={icon}/>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
            {saving && (
                    <>
                        <LoadingStatus error={savingError} errorText={"Something went wrong, try again"} loadingText={"Saving update"}/>
                    </>
                )}
                {savingStatus != null && (
                    <>
                        <div className="d-flex justify-content-center">
                            <h5>{savingStatus}</h5>
                        </div>
                    </>
                )}
        </div>
    )
}

export default IconsSelector;