import './App.css';
import React, { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import Map from './Map/Map';

function App() {
  return (
    <React.Fragment>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark '>
        <div className='d-flex flex-row mx-4'>
          <img id='logo-img' src='/logoEarth.png' alt='logo'/>
          <h1 className='text-white'>World Colletion</h1>
        </div>
        <ul className='navbar-nav'>
            <div className='d-flex mx-5'>
              <button type='button' className='btn btn-light btn-lg me-3'>Home</button>
              <button type='button' className='btn btn-light btn-lg me-3'>Find collectibles</button>
            </div>
          </ul>
        
      </nav>

      <div>
        <Map />
      </div>
      
    </React.Fragment>  
  );
}



export default App;
