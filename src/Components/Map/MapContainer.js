import React from 'react';
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import {GameContext} from "../Contexts/GameContext";
//sonic gif: https://media.giphy.com/media/5Mrn3s7rQRvPO/giphy.gif
//pikachu: https://images.newschoolers.com/images/17/00/68/70/05/687005_50w_50h_zc.gif

//beer stickers https://appadvice.com/game/app/beer-emoji-stickers/1228781193

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      location: ''
    }
  };
  componentWillMount() {
    console.log("Getting user location");
    if (navigator.geolocation) {
      console.log("Navigator has geolocation");
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("position and all that: ", position);
        this.setState({
          location:position,
          disableSubmit: false
        });

        console.log(this.state.location);
      },
    (err) => {
      console.log("error", err);
    }, {enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0});
    } else {
      console.error("Browser does not support Geolocation");
    }
  }
  onMarkerClick = (props, marker, e) =>
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });

    onMapClicked = (props) => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        });
      }
    };

  render() {
    const style = {
      flex: 1,
      width: '100vw',
      height: '75vh',
      'marginLeft': 'auto',
      'marginRight': 'auto'
    }
    const styles = [
    {

        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#165c64"
            },
            {
                "saturation": 34
            },
            {
                "lightness": -69
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#b7caaa"
            },
            {
                "saturation": -14
            },
            {
                "lightness": -18
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#cbdac1"
            },
            {
                "saturation": -6
            },
            {
                "lightness": -9
            },
            {
                "visibility": "on"

            }
        ]
    },
    {

        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#8d9b83"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -12
            },
            {
                "visibility": "on"

            }
        ]
    },
    {

        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#d4dad0"
            },
            {
                "saturation": -88
            },
            {
                "lightness": 54
            },
            {
                "visibility": "simplified"

            }
        ]
    },
    {

        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bdc5b6"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -3
            },
            {
                "visibility": "simplified"

            }
        ]
    },
    {

        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bdc5b6"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -26
            },
            {
                "visibility": "on"

            }
        ]
    },
    {
        "featureType": "poi",

        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#c17118"
            },
            {
                "saturation": 61
            },
            {
                "lightness": -45
            },
            {
                "visibility": "on"

            }
        ]
    },
    {

        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#8ba975"
            },
            {
                "saturation": -46
            },
            {
                "lightness": -28
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#a43218"
            },
            {
                "saturation": 74
            },
            {
                "lightness": -51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"

            }
        ]
    },
    {

        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#3a3935"
            },
            {
                "saturation": 5
            },
            {
                "lightness": -57
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#cba923"
            },
            {
                "saturation": 50
            },
            {
                "lightness": -46
            },
            {
                "visibility": "on"

            }
        ]
    }
]
    const mapCenterLat = (this.props.value.user.user_session_boundary.here_api_format[1] + this.props.value.user.user_session_boundary.here_api_format[3]) / 2;
    const mapCenterLng = (this.props.value.user.user_session_boundary.here_api_format[0] + this.props.value.user.user_session_boundary.here_api_format[2]) / 2;
    return (
      <div className="map-wrapper">
      <Map
        className={"challengeMap"}
        item
        xs = { 12 }
        style = { style }

        styles = {styles}

        google = { this.props.google }
        onClick = { this.onMapClicked }
        zoom = { 12 }
        initialCenter = {{
          lat: mapCenterLat,
          lng: mapCenterLng
        }}
      >
        {(this.state.location !== '')
          ?

          <Marker
            onClick={this.onMarkerClick}
            key={11}
            title = {"Your Location"}
            name = {"Your Location"}
            className="your-location"
            position = {
              {
                lat:this.state.location.coords.latitude,
                lng:this.state.location.coords.longitude
              }
            }
            icon={{
              url: "https://appstickers-cdn.appadvice.com/1228781193/822105646/589fd42340d873e911efed5297e7678e-4.gif",
              scaledSize: new this.props.google.maps.Size(65,65)
            }}
          />

          :

          null}
      {this.props.value.circuit.challenges.map((challenge, i) => {
          return <Marker
                    onClick={this.onMarkerClick}
                    key={i}
                    title = {challenge.location_gate.name}
                    position = {
                      {
                        lat:challenge.location_gate.position[0],
                        lng:challenge.location_gate.position[1]
                      }
                    }
                    name = {challenge.location_gate.name}
                    address = {challenge.location_gate.address.replace(/<br\s*\/?>/gi, '. ')}
                    challengeText = {challenge.full_challenge_text}
                  />
        })}
        {this.props.value.circuit.challenges.map((challenge, i) => {
            return <InfoWindow
                    key={"info" + i}
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                      <div>
                        <h1>{this.state.selectedPlace.challengeText}</h1>
                        <h2>{this.state.selectedPlace.name}</h2>
                        <h2>{this.state.selectedPlace.address ? <h2>Address: {this.state.selectedPlace.address}</h2> : ''}</h2>
                      </div>
                  </InfoWindow>
          })}
      </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyD81lHDGkpb3CORrbtfarHe44zpXnKtJu8')
})(MapContainer)
