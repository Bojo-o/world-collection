import './App.css';
import React, { useState, useEffect } from "react";
import Map from './Map/Map';
import Form from './DataSearching/Form';
import HomeState from './AppStates/HomeState';
import Editation from './AppStates/Editation';
import CollectibleSearching from './AppStates/CollectiblesSearching/CollectiblesSearching';
import CollectiblesAdding from './AppStates/CollectiblesAdding';
import { useMediaQuery } from 'react-responsive';

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
const collectibleAdditionState = () => {
  return (
    <>
      <CollectiblesAdding />
    </>
  )
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
  
  const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })

  const renderBrand = (nameFlag : boolean) => {
    return (
      <>
          <div className="navbar-header">
            <div className="navbar-brand d-flex ">
              <img src="/logoEarth.png" width="50" height="50" className="d-inline-block align-top" alt="logo"/>
              {nameFlag && (
                <h2 className='text-white'>World Colletion</h2>
              )}
            </div>
          </div>
      </>
    )
  }
  const renderStatesList = (classType : string) => {
    return (
      <>
        <li className={classType}>
          <button type='button' className='btn btn-outline-light btn-lg' onClick={() => {setAppState(homeState)}}>Home</button>
        </li>
        <li className={classType}>
          <button type='button' className='btn btn-outline-light btn-lg'onClick={() => {setAppState(collectiblesSearcherState)}}>Find collectibles</button>
        </li>
        <li className={classType}>
          <button type='button' className='btn btn-outline-light btn-lg' onClick={() => {setAppState(collectibleAdditionState)}}>Add Collectibles</button> 
        </li>
        <li className={classType}>
          <button type='button' className='btn btn-outline-light btn-lg'onClick={() => {setAppState(editCollectionsState)}}>Edit collections</button>
        </li>
      </>
    )
  }
  const renderDeskopNavbar = () => {
    return (
      <>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark' id='navbar'>
          {renderBrand(true)}
          <div className="collapse navbar-collapse" id="Navbar">
            <ul className='navbar-nav mr-auto'>
                {renderStatesList("nav-link")}
            </ul>
          </div>
        </nav>
      </>
    )
  }

  const renderMobileNavbar = () => {
    return (
      <>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark' id='navbar'>
            <div className='d-flex flex-row'>
              
              
              <div className='dropdown'> 
                <button type='button' className='btn btn-outline-light btn-lg me-3 dropdown-toggle' id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="navbar-toggler-icon"></span>
                </button>

                
                <ul className="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
                  {renderStatesList("dropdown-item")}               
                </ul>  
                      
              </div>
              {renderBrand(false)}
            </div>
            

        </nav>
      </>
    )
  }
  return (
    
    <>
      {isBigScreen && renderDeskopNavbar()}
      {!isBigScreen && renderMobileNavbar()}

      
        <div >
          {appState}
        </div>
      
    </>  
  );
}



export default App;
