/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TabBarIOS,
  View
} from 'react-native';
import PlaceMap from './place_map';
import AddPlace from './add_place';
//trying to add firebase to get places to persist
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBK7lJusfRkbZ4cejzsqe3my_S42M0Rbbw",
  authDomain: "places-react-native.firebaseapp.com",
  databaseURL: "https://places-react-native.firebaseio.com",
  storageBucket: "places-react-native.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class Places extends Component {

  constructor() {
    super();
    this.state = {
      selectedTab: 0,
      annotations: [
        {
          title: 'Home',
          latitude: 40.7788104,
          longitude: 73.94732549999999
        },
        {
          title: 'General Assembly',
          latitude: 40.7398848,
          longitude: 73.9900818
        },
        {
          title: 'Shake Shack',
          latitude: 40.7420371,
          longitude: 73.9875635
        }
      ]
    }
  }

  handleTabPress(tab) {
    this.setState({ selectedTab: tab })
  }

  handleAddPlace(annotation) {
    //add new places to state annotations to display pin on map
    const annotations = this.state.annotations.slice();
    annotations.push(annotation);
    this.setState({ annotations });
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          systemIcon="favorites"
          selected={this.state.selectedTab === 0}
          onPress={this.handleTabPress.bind(this, 0)}
        >
        <PlaceMap annotations={this.state.annotations} />
      </TabBarIOS.Item>
      <TabBarIOS.Item
        title="Place"
        icon={require('./assets/pin.png')}
        selected={this.state.selectedTab === 1}
        onPress={this.handleTabPress.bind(this, 1)}
      >
      <AddPlace onAddPlace={this.handleAddPlace.bind(this)}  />
      </TabBarIOS.Item>
    </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 50,
  },
  view: {
    backgroundColor: '#fed',
    flex: 1
  }
});

AppRegistry.registerComponent('Places', () => Places);
