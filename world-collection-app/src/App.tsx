import './App.css';
import React, { useState, useEffect } from "react";
import Map from './Map/Map';
import Form from './DataSearching/Form';
import HomeState from './AppStates/HomeState';
import Editation from './AppStates/Editation';
import CollectibleSearching from './AppStates/CollectiblesSearching/CollectiblesSearching';

const homeState = () => {
  return (
    <HomeState />
  )
}

const collectiblesSearcherState = () => {
  return (
    //<Form />
    <CollectibleSearching />
  );
}

const editCollectionsState = () => {
  return(
    <>
      <Editation />
    </>
  );
}


function App() {
  const [appState,setAppState] = useState<JSX.Element>(homeState);

  
  return (
    
    <React.Fragment>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark '>
        <div className='d-flex flex-row mx-4'>
          <img id='logo-img' src='/logoEarth.png' alt='logo'/>
          <h1 className='text-white'>World Colletion</h1>
        </div>
        <ul className='navbar-nav'>
            <div className='d-flex mx-5'>
              <button type='button' className='btn btn-light btn-lg me-3' onClick={() => {setAppState(homeState)}}>Home</button>
              <button type='button' className='btn btn-light btn-lg me-3'onClick={() => {setAppState(collectiblesSearcherState)}}>Find collectibles</button>
              <button type='button' className='btn btn-light btn-lg me-3'onClick={() => {setAppState(editCollectionsState)}}>Edit collections</button>
            </div>
          </ul>
        
      </nav>
      
      <div>
        {appState}
      </div>
      
    </React.Fragment>  
  );
}



export default App;
