import React, { Component } from 'react';
import {
  MapView,
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Linking }
from 'react-native';

export default class PlaceMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
     currentRegion: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      title: ""
     }
    }
  }

  componentDidMount() {
    //getting the device geolocation using the navigator object
    navigator.geolocation.getCurrentPosition(
      (position) => {
       console.log(position);
        this.setState({currentRegion: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
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
    //adds a button to each favorite place for navigation
    const { annotations } = this.props;
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
  }
});
