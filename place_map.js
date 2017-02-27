import React, { Component } from 'react';
import {
  MapView,
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Linking }
from 'react-native';
import axios from 'axios';

export default class PlaceMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
     currentRegion: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
     }
    }
  }

  componentDidMount() {
    //getting the device geolocation using the navigator object
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({currentRegion: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }});
        this.getBurritoData();
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  getBurritoData() {
    //axios request to get all nearby burrito spots, setting it to annotations to render
    //on the map
    axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.currentRegion.latitude},${this.state.currentRegion.longitude}&radius=5000&types=food&keyword=burrito&key=AIzaSyDNhxQlwToYhiZuucMmLly6m_YTz1P0KOQ&limit=20`)
    .then((response) => {
      console.log(response.data.results[0]);
      response.data.results.forEach((burrito) => {
      this.props.onAddPlace({
          title: burrito.name,
          subtitle: 'Rating: ' + burrito.rating,
          latitude: parseFloat(burrito.geometry.location.lat),
          longitude: parseFloat(burrito.geometry.location.lng),
          image: require('./assets/burrito.png')
        });
      })
    })
  }

  handleNavigation(la, lo) {
    //handle click of navigation and set lat and lng, then pass it through
    //apple maps api, use Linking react-native built in
    const rla = this.state.currentRegion.latitude;
    const rlo = this.state.currentRegion.longitude;
    const url = `http://maps.apple.com/?saddr=${rla},${rlo}&daddr=${la},${lo}&dirflg=d`;
    return Linking.openURL(url);
  }

  render() {
    const { annotations } = this.props;
    //adds a button to each place for navigation
    annotations.forEach(annotation => {
      annotation.rightCalloutView = (
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleNavigation.bind(this, annotation.latitude, annotation.longitude)}
        >
        <Text style={styles.buttonText}>Navigation</Text>
        </TouchableHighlight>
      );
    })
    return (
      <MapView
        style={styles.map}
        region={this.state.currentRegion}
        annotations={this.props.annotations}
        //add beacon for user location
        showsUserLocation={true}
      />
    )
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  button: {
    backgroundColor: 'red',
    padding: 5,
    margin: 5
  },
  buttonText: {
    fontSize: 12,
    color: 'white'
  },
  text: {
    color: 'blue'
  }
});
