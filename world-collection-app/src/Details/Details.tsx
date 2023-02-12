import React from "react";
import { EntityDetailsData } from "../Data/EntityDetailsData";
import { ResultData } from "../Data/ResultsData";
import { SearchAPI } from "../DataSearching/SearchAPI";
import './Details.css';

export interface DetailsProps{
    QNumber : string;
    name : string;
    type : string;
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
function Details({QNumber,name,type} : DetailsProps){

    const [details,setDetails] = React.useState<EntityDetailsData>();
    const [areDetailsLoaded,setAreDetailsLoaded] = React.useState(false);

    const [wikipediaLink,setWikipediaLink] = React.useState('');
    const [isWikipediaLinkLoaded,setWikipediaLinkLoaded] = React.useState(false);

    React.useEffect(() => {
        SearchAPI.getEntityDetails(QNumber).then((details) => {
            console.log(details)
            setDetails(details);
            setAreDetailsLoaded(true);
        })

        SearchAPI.getEntityWikipediaLink(QNumber).then((data) => {
            if (data[0]['link'] !== undefined){ 
                setWikipediaLink(data[0]['link']);
                setWikipediaLinkLoaded(true)
            }
        })
    },[]);

    return(
        <React.Fragment>

            <div className="card ">
                {details?.image != '' && (
                    <img src={details?.image}  className="card-img-top" alt="image"/>
                )}
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{type.replaceAll('/',', ')}</h6>
                    {areDetailsLoaded ? (
                        <React.Fragment>
                            <p className="card-title">Details:</p>
                            <ul className="list-group list-group-flush">
                                {details?.details.map((detail,index) => {                                   
                                    return (<li key={index} className="list-group-item"><strong>{detail.name} : </strong>{ProcessValue(detail.name,detail.value)}</li>)
                                })}
                                {isWikipediaLinkLoaded && (
                                    <li className="list-group-item"><strong>Wikipedia : </strong><a href={wikipediaLink} target="_blank">Link</a></li>
                                )}
                            </ul>
                        </React.Fragment>
                    ) : (
                        <p className="card-title">Loading details</p>
                    )}

                    
                </div>
                
            </div>
        </React.Fragment> 
    );
}

export default Details;