import React from "react";
import { ResultData } from "../Data/ResultsData";

export interface ResultsTableProps{
    results : ResultData[];
}

function ResultsTable ({results} : ResultsTableProps) {
    const [data,setData] = React.useState<ResultData[]>(results);
    const [edited,setEdited] = React.useState<ResultData>(new ResultData);

    React.useEffect(() => {
        
    })


    const removeItem = (qNumber : string) =>{      
        setData((prevData) => {           
            return prevData.filter((item) => item.QNumber != qNumber)
        });
    }
    const editItem = (row : ResultData) => {
        setEdited(new ResultData(row));     
    }
    const handleCancel = () => {
        setEdited(new ResultData)
    }
    const handleSave = (event:any) => {
        setData((data) => {
            return data.map((d) => {
                if (d.QNumber === edited.QNumber){
                    return edited;
                }
                return d;
            })
        })
        setEdited(new ResultData)
    }
    const handleChange = (event : any) => {
        const value = event.target.value;
        
        const change = {
            name: value,
        };
        setEdited((prev) => {
            return new ResultData({...prev,...change});
        });
    }
    return (
        <React.Fragment>
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

                    data.slice(0,1000).map((row,index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{index+1}</th>
                                
                                {edited.QNumber === row.QNumber && 
                                    (
                                        <React.Fragment>
                                            <td><input type="text" className="form-control" value={edited.name} onChange={handleChange}/></td>
                                            <td>{row.instanceOf.replaceAll("/"," , ")}</td>
                                            <td><button type="button" className="btn btn-success" onClick={handleSave}>Save</button></td>
                                            <td><button key={index} type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button></td>
                                        </React.Fragment>
                                    )
                                }
                                {edited.QNumber !== row.QNumber && 
                                    (
                                        <React.Fragment>
                                            <td>{row.name}</td>
                                            <td>{row.instanceOf.replaceAll("/"," , ")}</td>
                                            <td><button type="button" className="btn btn-primary" onClick={() => editItem(row)}>Edit</button></td>
                                            <td><button key={index} type="button" className="btn btn-danger" onClick={() => removeItem(row.QNumber)}>Remove</button></td>
                                        </React.Fragment>    
                                    )
                                }                               
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>

        <select>
            <option selected value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
        </select>
        </React.Fragment>
    );
}

export default ResultsTable