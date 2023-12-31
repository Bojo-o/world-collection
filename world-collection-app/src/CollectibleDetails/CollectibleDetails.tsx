import { useEffect, useState } from "react";
import { WikiDataAPIProxy } from "../API/WikiDataAPIProxy";
import { CollectibleDetail } from "../Data/CollectibleModels/CollectibleDetails";
import LoadingStatus from "../Gadgets/LoadingStatus";
import './CollectibleDetail.css';

/**
 * Props necessary for CollectibleDetails.
 */
export interface CollectibleDetailsProps {
    /**QNumber of collectible/raw collectible, whose details we want to show details. */
    QNumberOfCollectible: string
}
/**
 * Func fetching and rendering collectible`s details.
 * It contains mechanism for displaying various data type of details such as Time, Url ...
 * Details are displayed in scrollable list of details. Each detail values is wrapped in badge with specific color representing data type of detail.
 * @param  CollectibleDetailsProps See CollectibleDetailsProps description.
 * @returns JSX element rendering scrolling list of collectible`s details.
 */
function CollectibleDetails({ QNumberOfCollectible: collectibleQNumber }: CollectibleDetailsProps) {
    const [details, setDetails] = useState<CollectibleDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [detailFilter, setDetailFilter] = useState<string>("");
    const [wikipediaLink, setWikipediaLink] = useState<string | null>(null);


    /** Convert time as string with time precision into human readable text. */
    const timeToString = (value: string, timePrecision: number | null) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        let temp = value;
        let BCE: string = "";
        if (temp[0] === "-") {
            temp = temp.slice(1);
            BCE = " BCE";
        }
        temp = temp.split('T')[0]

        if (timePrecision == null) {
            timePrecision = 11;
        }

        // to understand time precision better see : https://www.wikidata.org/wiki/Help:Dates
        let val: string[] = temp.split("-");
        switch (timePrecision) {
            case 11:
                return val[2] + " " + monthNames[Number.parseInt(val[1]) - 1] + " " + val[0] + BCE;
            case 10:
                return monthNames[Number.parseInt(val[1]) - 1] + " " + val[0] + BCE;
            case 9:
                return val[0] + BCE;
            case 8:
                return Math.floor(Number.parseInt(val[0]) / 10) + "0s" + BCE;
            case 7:
                return (Math.floor(Number.parseInt(val[0]) / 100)) + "th century" + BCE;
            case 6:
                return (Math.floor(Number.parseInt(val[0]) / 1000) + 1) + "millenium" + BCE;
            case 5:
                return val[0] + " years" + BCE;
            case 3:
                return Math.floor(Number.parseInt(val[0]) / 1000000) + " million years" + BCE;
            case 0:
                return Math.floor(Number.parseInt(val[0]) / 1000000000) + " bilion years" + BCE;
            default:
                return temp;
        }

    }

    const handleDetailSearch = (event: any) => {
        const value = event.target.value;
        setDetailFilter(value);
    }

    useEffect(() => {
        const fetchWikipediaLink = () => {
            WikiDataAPIProxy.getCollectibleWikipediaLink(collectibleQNumber).then((data) => {
                if (data !== "") {
                    setWikipediaLink(data);
                }
            }).catch(() => { })
        }
        const fetchDetails = () => {
            setLoading(true);
            setError(false);
            WikiDataAPIProxy.getCollectibleDetails(collectibleQNumber).then((data) => {
                setLoading(false);
                setDetails(data);

            }).catch(() => {
                setError(true);
            })
        }
        fetchDetails()
        fetchWikipediaLink();
    }, [collectibleQNumber])

    return (
        <>
            {loading && (
                <>
                    <LoadingStatus error={error} errorText={"Something went wrong, try again"} loadingText={"Loading details"} />
                </>
            )}
            {!loading && (
                <>
                    {wikipediaLink != null && (
                        <div className="d-flex flex-row">
                            <h6>Wikipedia Link: </h6>
                            <a href={wikipediaLink} target="_blank" rel="noopener noreferrer">Link</a>
                        </div>
                    )}
                    <input className="form-control mr-sm-2" type="search" placeholder="Search for detail" onChange={handleDetailSearch} />
                    <div className="details_scroll">
                        <ul data-testid="list of details" className="list-group">
                            {details.filter((d) => d.propertyName.toLocaleLowerCase().includes(detailFilter.toLocaleLowerCase())).map((detail, index) => {
                                return (
                                    <li key={index} className="list-group-item">
                                        <div className="d-flex flex-column">
                                            <h6 key={index}><strong>{detail.propertyName}</strong></h6>
                                            <div className="d-flex flex-wrap">
                                                {detail.values.map((value,index) => {
                                                    return (
                                                        <div key={index}>
                                                            {detail.dataType === "Url" && (
                                                                <>
                                                                    <span key={index} className="badge bg-info text-dark">
                                                                        <a key={index} href={value} target="_blank" rel="noopener noreferrer">Link</a>
                                                                    </span>
                                                                </>
                                                            )}
                                                            {detail.dataType === "Quantity" && (
                                                                <>
                                                                    <span key={index} className="badge bg-warning text-dark">
                                                                        {(detail.unit != null && detail.unit !== "1") ? value + " " + detail.unit : value}
                                                                    </span>
                                                                </>
                                                            )}
                                                            {(detail.dataType === "Monolingualtext" || detail.dataType === "WikibaseItem") && (
                                                                <>
                                                                    <span key={index} className="badge bg-primary">
                                                                        {value}
                                                                    </span>
                                                                </>
                                                            )}
                                                            {detail.dataType === "Time" && (
                                                                <>
                                                                    <span key={index} className="badge bg-success">
                                                                        {timeToString(value, detail.timePrecision)}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                        </div>
                                    </li>
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