import './App.css';
import React, { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';


function App() {
    const [data, setdata] = useState({
      name: "",
      age: 0,
      date: "",
      programming: "",
     });

     useEffect(() => {
      // Using fetch to fetch the api from 
      // flask server it will be redirected to proxy
      fetch("/data").then((res) =>
          res.json().then((data) => {
              // Setting a data from api
              setdata({
                  name: data.Name,
                  age: data.Age,
                  date: data.Date,
                  programming: data.programming,
              });
          })
      );
  }, []);

    return (
      /*
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />         
      </MapContainer>
      */
      <div className="App">
      <header className="App-header">
          <h1>React and flask</h1>
          {/* Calling a data from setdata for showing */}
          <p>{data.name}</p>
          <p>{data.age}</p>
          <p>{data.date}</p>
          <p>{data.programming}</p>

      </header>
  </div>
    );
}
  


export default App;
