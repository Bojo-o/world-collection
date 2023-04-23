import { useEffect, useState } from "react";
import { Collectible } from "../Data/Database/Collectible";
import data from '../Data/icons.json'
import { DatabaseAPI } from "../API/DatabaseAPI";
import LoadingStatus from "../Gadgets/LoadingStatus";
import './IconsSelector.css'

export interface IconsSelectorProps{
    handleChangeOfIcon : (icon : string) => void;
    iconChange : (settedIcon : string) =>  Promise<string>;
}
function IconsSelector({handleChangeOfIcon,iconChange} : IconsSelectorProps){
    const [listOfIcons,setListOfIcons] = useState<string[]>([]);
    const [saving,setSaving] = useState(false);
    const [savingError,setSavingError] = useState(false);
    const [savingStatus,setSavingStatus] = useState<string|null>(null)

    const handleIconChange = (icon : string) => {
        setSaving(true);
        setSavingError(false);
        setSavingStatus(null);
        iconChange(icon).then((status) => {
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
                                    <img  onClick={() => handleIconChange(icon)} src={ require('../static/Icons/' + icon + '.png')} className="img-thumbnail icon" alt={icon}/>
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