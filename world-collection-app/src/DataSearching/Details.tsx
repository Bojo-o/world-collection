import React from "react";
import { EntityDetailsData } from "../Data/EntityDetailsData";
import { ResultData } from "../Data/ResultsData";
import { SearchAPI } from "./SearchAPI";
import './Details.css';

export interface DetailsProps{
    entity : ResultData;
}

function ProcessValue(name: string,value : string) {
    let values : string[] = value.split('</>')
    
    return (
        <React.Fragment>
            <ul>
                {values.map((value,index) => {
                    if (name === "inception"){
                        let date = new Date(value)
                        const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                        ];
                        return (<li key={index}>{date.getFullYear() + " " + monthNames[date.getMonth()] + " " + date.getDay()}</li>)
                    }
                        
                    return (<li key={index}>{                       
                        value.startsWith("http") ? (<a href={value} target="_blank">{value}</a>): value
                        }</li>)
                })}
            </ul>
        </React.Fragment>
    );
}
function Details({entity} : DetailsProps){

    const [details,setDetails] = React.useState<EntityDetailsData>();
    const [areDetailsLoaded,setAreDetailsLoaded] = React.useState(false);

    const [wikipediaLink,setWikipediaLink] = React.useState('');
    const [isWikipediaLinkLoaded,setWikipediaLinkLoaded] = React.useState(false);

    React.useEffect(() => {
        SearchAPI.getEntityDetails(entity).then((details) => {
            setDetails(details);
            setAreDetailsLoaded(true);
        })
    },[]);

    return(
        <React.Fragment>
            <h4>Details :</h4>
            {areDetailsLoaded ? (
                <React.Fragment>                   
                    {details?.details.length == 0 ? (<p>No Details</p>) : 
                        <React.Fragment>
                            
                            <ul>
                                {details?.details.map((detail,index) => {
                                    if (detail.name === "image" ){                                       
                                        return (<img src={detail.value} className="image img-thumbnail" alt="image"/>);
                                    }
                                    
                                    return (<li key={index}><strong>{detail.name} : </strong>{ProcessValue(detail.name,detail.value)}</li>)
                                })}
                            </ul>

                            
                        </React.Fragment>
                    }
                </React.Fragment>
            ) : (<h4>Loading details</h4>)
            }
        </React.Fragment> 
    );
}

export default Details;