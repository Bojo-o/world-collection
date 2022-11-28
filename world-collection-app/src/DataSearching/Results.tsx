import React from 'react'
import { ResultData } from '../Data/ResultsData';
import ViewMap from '../Map/ViewMap';
import ResultsTable from './ResultsTable';
import './Results.css'

export interface ResultProps{
    data : ResultData[];
}
enum View {
    Table,
    Map,
}
function Result({data} : ResultProps) {
    const [resultData,setResultData]  = React.useState<ResultData[]>(data);
    const [viewType,setViewType] = React.useState<View>(View.Table);

    const setView = (view : View) => {
        setViewType(view);
    }
    const removeItem = (qNumber : string) => {      
        setResultData((prevData) =>    
            prevData.filter((item) => item.QNumber != qNumber)
        );
    }
    const saveItem = (edited : ResultData) => {
        setResultData((data) => {
            return data.map((d) => {
                if (d.QNumber === edited.QNumber){
                    return edited;
                }
                return d;
            })
        })
    }
    return (
        <React.Fragment>
            <h3>Results</h3>
            <div className="btn-group dropend">
                <button type="button" className="btn btn-danger dropdown-toggle"  id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    View
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a className="dropdown-item" onClick={() => setView(View.Table)}>Table</a></li>
                    <li><a className="dropdown-item" onClick={() => setView(View.Map)}>Map</a></li>                    
                </ul>         
            </div>
            {viewType === View.Table ? < ResultsTable results={resultData} removeItem={removeItem} saveItem={saveItem}/> : <ViewMap waypoints={resultData} removeItem={removeItem}/>}     
        </React.Fragment>
    );
}

export default Result;