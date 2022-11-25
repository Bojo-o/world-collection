import React from "react";
import { ResultData } from "../Data/ResultsData";

export interface ResultsTableProps{
    results : ResultData[];
}

function ResultsTable ({results} : ResultsTableProps) {
    const [data,setData] = React.useState<ResultData[]>(results);
    const removeItem = (qNumber : string) =>{
        setData((prevData) => {
            return prevData.filter((item) => item.qNumber != qNumber)
        });
    }
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Sub-Type of</th>
                </tr>
            </thead>

            <tbody>
                {
                    data.map((row,index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{index+1}</th>
                                <td>{row.name}</td>
                                <td>{row.instanceOf.replaceAll("/"," , ")}</td>
                                <td><button type="button" className="btn btn-primary">Edit</button></td>
                                <td><button key={index} type="button" className="btn btn-danger" onClick={() => removeItem(row.qNumber)}>Remove</button></td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}

export default ResultsTable