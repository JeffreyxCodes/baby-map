import React, { Component } from 'react';

const APIKEY = process.env.REACT_APP_API_KEY;

class App extends Component {
  constructor() {
    super();

    this.LM = window.L.mapquest;
    this.LM.key = APIKEY;
    this.map = undefined;
    this.icons = {
      base: {
        primaryColor: '#1BC587',
        secondaryColor: '#1BC587',
        shadow: true,
        size: 'md',
        symbol: 'Start'
      }
    }

    this.state = {
      baseGeoLocation: [43.642567, -79.387054],
      range: 10000,
    }
  }

  componentDidMount() {
    // get map to display
    this.map = this.LM.map('map', {
      center: this.state.baseGeoLocation,
      layers: this.LM.tileLayer('map'),
      zoom: 12
    });

    // add controls
    this.map.addControl(this.LM.control());

    // add search controls
    let searchControl = this.LM.searchControl({
      className: '',
      hoverMarker: {
        icon: 'marker',
        iconOptions: {
          size: 'sm',
          primaryColor: '#333333',
          secondaryColor: '#333333'
        }
      },
      search: {
        sort: 'relevance',
        circle: `${this.state.baseGeoLocation[1]},${this.state.baseGeoLocation[0]},${this.state.range}`,
        pageSize: 20
      },
      searchInput: {
        searchAheadOptions: {
          limit: 6,
          collection: 'address,adminArea,airport,poi,category,franchise'
        },
        compactResults: true,
        placeholderText: 'Search',
        clearTitle: 'Clear search'
      },
      searchLayer: {
        buffer: 256,
        collisionMargin: 2,
        marker: {
          icon: 'via',
          iconOptions: {
            primaryColor: '#ffffff',
            secondaryColor: '#333333',
            size: 'lg'
          },
          popupEnabled: true
        },
        // paddingTopLeft: [420, 20],
        // paddingBottomRight: [20, 20],
        searchResponse: {},
        updateResultsOnMapMove: true
      }
    }).addTo(this.map);

    // locate your location and center your map on it
    this.map.locate({
      setView: true,
      maxZoom: 12,
      enableHighAccuracy: true,
    })

    // once current location is found, set it to base
    this.map.once('locationfound', (e) => {
      this.setState({
        baseGeoLocation: [e.latlng.lat, e.latlng.lng]
      }, () => {
        // put a marker on it
        window.L.marker(this.state.baseGeoLocation, {
          icon: this.LM.icons.flag(this.icons.base),
          draggable: false
        }).addTo(this.map);

        // add circle around base
        window.L.circle(this.state.baseGeoLocation, { radius: this.state.range }).addTo(this.map);
      });
    });
  }

  render() {
    return (
      <div className="App">
        <div id="map"></div>
      </div>
    );
  }
}

export default App;
