import './App.css';
import React, { useState} from "react";
import HomeState from './AppStates/HomeState';
import Editation from './AppStates/Editation';
import CollectibleSearching from './AppStates/CollectiblesSearching/CollectiblesSearching';
import CollectiblesAdding from './AppStates/CollectiblesAdding';
import { useMediaQuery } from 'react-responsive';


/**
 * Function with hooks, which represents the entire appliacation.
 * It contains mechanism for storing state of app and state selecting.
 * State represents, what will be rendered on the screen. For each state there is specific part of app, which renders.
 * It represent a state pattern.
 * Also, it contains app menu bar rendering mechanism. In that bar the user can select application state.
 * @returns JSX of the entire App.
 */
function App() {
  /**
   * Renders home state. It is the part of the app where user can view his collection, see his collectibles,that are displayed on the map.
   * @returns JSX element rendering home state.
   */
  const renderHomeState = () => {
    return (
      <HomeState />
    )
  }
  /**
   * Renders state, which is the part of the app where user searches for collectibles, they may want to collect, based on some restrictions such as defined area or filters.
   * @returns JSX element rendering collectibleSearching state.
   */
  const renderCollectiblesSearchingState = () => {
    return (
      <CollectibleSearching />
    );
  }
  /**
   * Renders state, which is the part of the app where user manually one by one searches for collectible, then it can be added into collections.
   * @returns JSX element rendering collectible addition state.
   */
  const renderCollectibleAdditionState = () => {
    return (
      <>
        <CollectiblesAdding />
      </>
    )
  }
  /**
   * Renders editation state. It is the part of the app where user can manage and edit his collections and collections`s collectibles.
   * @returns JSX element rendering editation state.
   */
  const renderEditationState = () => {
    return(
      <>
        <Editation />
      </>
    );
  }

  // STATES
  const [currentState,setCurrentState] = useState<JSX.Element>(renderHomeState);
  
  /**
   * Flag for determining, if entity will be rendered for small or big screens.
   * To achieve responsiveness, it is necessary to render menu bar otherwise on the small screens than big screens.
   */
  const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' })

  /**
   * Renders logo of application.
   * @param renderNameFlag Flag, if true, then it also render name of application.
   * @returns JSX element, which renders brand of app.
   */
  const renderBrand = (renderNameFlag : boolean) => {
    return (
      <>
          <div className="navbar-header">
            <div className="navbar-brand d-flex ">
              <img src="/logoEarth.png" width="50" height="50" className="d-inline-block align-top" alt="logo"/>
              {renderNameFlag && (
                <h2 className='text-white'>World Colletion</h2>
              )}
            </div>
          </div>
      </>
    )
  }
  /**
   * Renders list of buttons.Those Buttons are responsible for setting the state of application.
   * @param classNameOfLi Value of className for <li> element.
   * @returns JSX element represinting list of buttons, which set state of app.
   */
  const renderListWithStateButtons = (classNameOfLi : string) => {
    return (
      <>
        <li className={classNameOfLi}>
          <button type='button' className='btn btn-outline-light btn-lg' onClick={() => {setCurrentState(renderHomeState)}}>Home</button>
        </li>
        <li className={classNameOfLi}>
          <button type='button' className='btn btn-outline-light btn-lg'onClick={() => {setCurrentState(renderCollectiblesSearchingState)}}>Find collectibles</button>
        </li>
        <li className={classNameOfLi}>
          <button type='button' className='btn btn-outline-light btn-lg' onClick={() => {setCurrentState(renderCollectibleAdditionState)}}>Add Collectibles</button> 
        </li>
        <li className={classNameOfLi}>
          <button type='button' className='btn btn-outline-light btn-lg'onClick={() => {setCurrentState(renderEditationState)}}>Edit collections</button>
        </li>
      </>
    )
  }
  /**
   * Renders navbar,which is used on bigger screens.
   * @returns JSX element of navbar.
   */
  const renderNavbarForDeskop = () => {
    return (
      <>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark' id='navbar'>
          {renderBrand(true)}
          <div className="collapse navbar-collapse" id="Navbar">
            <ul className='navbar-nav mr-auto'>
                {renderListWithStateButtons("nav-link")}
            </ul>
          </div>
        </nav>
      </>
    )
  }
  /**
   * Renders navbar,which is used on smaller screens.
   * @returns JSX element of navbar.
   */
  const renderNavbarForMobile = () => {
    return (
      <>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark' id='navbar'>
            <div className='d-flex flex-row'>
            
              <div className='dropdown'> 
                <button type='button' className='btn btn-outline-light btn-lg me-3 dropdown-toggle' id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="navbar-toggler-icon"></span>
                </button>

                <ul className="dropdown-menu bg-dark " aria-labelledby="navbarDropdown">
                  {renderListWithStateButtons("dropdown-item")}               
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
      {isBigScreen && renderNavbarForDeskop()}
      {!isBigScreen && renderNavbarForMobile()}
      <div >
        {currentState}
      </div>    
    </>  
  );
}

export default App;
