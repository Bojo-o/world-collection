import { useEffect, useState } from "react";
import { WikiDataAPI } from "../API/WikiDataAPI";
import { CollectibleDetail } from "../Data/CollectibleModels/CollectibleDetails";

import { Collectible } from "../Data/DatabaseModels/Collectible";
import LoadingStatus from "../Gadgets/LoadingStatus";
import './CollectibleDetail.css';

export interface CollectibleDetailsProps{
    collectibleQNumber : string
}
function CollectibleDetails({collectibleQNumber} : CollectibleDetailsProps){
    const [details,setDetails] = useState<CollectibleDetail[]>([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const [detailFilter,setDetailFilter] = useState<string>("");
    const [wikipediaLink,setWikipediaLink] = useState<string|null>(null);

    const fetchWikipediaLink = () => {
        WikiDataAPI.getCollectibleWikipediaLink(collectibleQNumber).then((data) => {
            if (data != ""){
                setWikipediaLink(data);
            }
        }).catch(() => {})
    }
    const fetchDetails = () => {
        setLoading(true);
        setError(false);
        WikiDataAPI.getCollectibleDetails(collectibleQNumber).then((data) => {
            setLoading(false);
            setDetails(data);
            
        }).catch(() => {
            setError(true);
        })
    }
    const timeToString = (value: string,timePrecision : number|null) => {

        const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
        let temp = value;
        let BCE : string = "";
        if (temp[0] === "-"){
            temp = temp.slice(1);
            BCE =" BCE";
        }
        temp = temp.split('T')[0]

        if (timePrecision == null){
            timePrecision = 11;
        }
        
        let val : string[] = temp.split("-");
        switch(timePrecision){
            case 11:
                return val[2] + " " + monthNames[Number.parseInt(val[1]) - 1]+ " " + val[0] + BCE;
            case 10:
                return monthNames[Number.parseInt(val[1]) - 1]+ " " + val[0] + BCE;
            case 9:
                return val[0] + BCE;
            case 8:
                return Math.floor(Number.parseInt(val[0])/10) + "0s" + BCE;
            case 7:
                return (Math.floor(Number.parseInt(val[0])/100)) + "th century" + BCE;
            case 6:
                return (Math.floor(Number.parseInt(val[0])/1000) + 1) + "millenium" + BCE;
            case 5:
                return val[0] + " years" + BCE;
            case 3:
                return Math.floor(Number.parseInt(val[0])/1000000) + " million years" + BCE;
            case 0:
                return Math.floor(Number.parseInt(val[0])/1000000000) + " bilion years" + BCE;
            default :
                return temp;
        }
        
    }
    const handleDetailSearch = (event : any) => {
        const value = event.target.value;
        setDetailFilter(value);  
    }
    useEffect(() => {
        fetchDetails()
        fetchWikipediaLink();
    },[])
    return(
        <>
            {loading && (
                    <>
                        <LoadingStatus error={error} errorText={"Something went wrong, try again"} loadingText={"Loading details"}/>
                    </>
            )}
            {!loading && (
                <>
                {wikipediaLink != null && (
                    <div className="d-flex flex-row">
                        <h6>Wikipedia Link: </h6>
                        <a href={wikipediaLink} target="_blank">Link</a>
                    </div>
                )}
                <input className="form-control mr-sm-2" type="search" placeholder="Search for detail"  onChange={handleDetailSearch}/>
                    <div className="details_scroll">
                        <ul className="list-group">
                            {details.filter((d) =>  d.propertyName.toLocaleLowerCase().includes(detailFilter.toLocaleLowerCase())).map((detail,index) => {
                                return(
                                    <>
                                        <li key={index} className="list-group-item">
                                            <div className="d-flex flex-column">
                                                <h6><strong>{detail.propertyName}</strong></h6>
                                                <div className="d-flex flex-wrap">
                                                    {detail.values.map((value) => {
                                                        return(
                                                            <>
                                                                {detail.dataType == "Url" && (
                                                                    <>
                                                                        <span key={index} className="badge bg-info text-dark">
                                                                            <a href={value} target="_blank">Link</a>
                                                                        </span>
                                                                    </>
                                                                )}
                                                                {detail.dataType == "Quantity" && (
                                                                    <>
                                                                        <span key={index} className="badge bg-warning text-dark">
                                                                            {(detail.unit != null && detail.unit != "1") ? value + " " + detail.unit : value}
                                                                        </span>
                                                                    </>
                                                                )}
                                                                {(detail.dataType == "Monolingualtext" || detail.dataType == "WikibaseItem") && (
                                                                    <>
                                                                        <span key={index} className="badge bg-primary">
                                                                            {value}
                                                                        </span>
                                                                    </>
                                                                )}
                                                                {detail.dataType == "Time" && (
                                                                    <>
                                                                        <span key={index} className="badge bg-success">
                                                                            {timeToString(value,detail.timePrecision)}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                                
                                            </div>
                                        </li>
                                    </>
                                )
                            })}
                        </ul>
                    </div>
                </>
            )}
        </>
    )
}
export default CollectibleDetails;