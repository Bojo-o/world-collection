import React from 'react'
import Map from '../Map/Map';
import './HomeState.css';

function HomeState() {
    return(
        <React.Fragment>
            
            <div className='d-flex w-100'> 
                <div className='d-flex flex-column w-25 border border-dark border-2 rounded-end'>
                    <h1>Colections</h1>
                    <ul>                                               
                        <li>item 1</li>
                        <li>item 2</li>
                        <li>item 3</li>
                    </ul>
                </div>              
                <Map />
            </div>

        </React.Fragment>  
    );
}

export default HomeState;