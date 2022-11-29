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
    const [resultsToRender,setResultsToRender] = React.useState<ResultData[]>(data);
    const [viewType,setViewType] = React.useState<View>(View.Table);

    const [edited,setEdited] = React.useState<ResultData>(new ResultData);
    const [nameFilter,setNameFilter] = React.useState<string>('')

    const editItem = (row : ResultData) => {
        setEdited(new ResultData(row));     
    }
    const cancelItem = () => {
        setEdited(new ResultData)
    }

    const setView = (view : View) => {
        setViewType(view);
    }
    const removeItem = (qNumber : string) => {      
        setResultData((prevData) =>    
            prevData.filter((item) => item.QNumber != qNumber)
        );
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
    const saveItem = (edited : ResultData) => {
        setResultData((data) => {
            return data.map((d) => {
                if (d.QNumber === edited.QNumber){
                    return edited;
                }
                return d;
            })
        })
        setEdited(new ResultData)
    }
    const handleResultsSearch = (event : any) => {
        const value = event.target.value;
        setNameFilter(value);  
    }
    React.useEffect(() =>{
        if (nameFilter !== ''){
            setResultsToRender(resultData.filter((result) => result.name.includes(nameFilter)))
        }else{
            setResultsToRender(resultData);
        }
    },[nameFilter])
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
            <input type="text" className="form-control" placeholder={"Search for name"} onChange={handleResultsSearch}/>
            {viewType === View.Table ? < ResultsTable results={resultsToRender} handleChange={handleChange} cancelItem={cancelItem} edited={edited}  editItem={editItem} removeItem={removeItem} saveItem={saveItem}/>
            : <ViewMap waypoints={resultsToRender} removeItem={removeItem}  handleChange={handleChange} cancelItem={cancelItem} edited={edited}  editItem={editItem} saveItem={saveItem}/>}     
        </React.Fragment>
    );
}

export default Result;