import './App.css';
import React, { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';


class App extends React.Component {
  state = {
    isLoading: true,
    waypoints: [],
    error: null
  };

  getFetchWaypoints() {
    this.setState({
      loading: true
    }, () => {
      fetch("/waypoints").then((response) => response.json()).then((jsonData) => {       
        this.setState({
          waypoints: jsonData
        })
      })
    });
  }
  componentDidMount() {
    this.getFetchWaypoints();
  }

  render(): React.ReactNode {
    const {
      waypoints,
      error
    } = this.state;

    return (
      <React.Fragment>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            waypoints.map(waypoint => {
              const {
                id,
                name,
                lati,
                long
              } = waypoint;
              return (

                <Marker
                  key={id}
                  position={[long, lati]}>
                </Marker>

              )
            })
          }
          <Marker position={[50, 50]}>
            <Popup>
              'adad'
            </Popup>
          </Marker>
          <Marker position={[40, 50]}>
            <Popup>
              'adad'
            </Popup>
          </Marker>
        </MapContainer>
      </React.Fragment>
    );
  }


  //fetch("/waypoints").then((response) => response.json()).then((jsonData) => {console.log(jsonData)})

  /*
  fetch("/waypoints").then(res => res.json()).then(result =>  this.setState({
    loading: false,
    waypoints: result
  })).catch(console.log);
  console.log(this.state.waypoint)
  */

}



export default App;
