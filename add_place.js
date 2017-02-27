import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
  StyleSheet,
  AlertIOS }
from 'react-native'
import dismissKeyboard from 'dismissKeyboard';
import axios from 'axios';

export default class AddPlace extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      latitude: '',
      longitude: '',
      titleError: '',
      latitudeError: '',
      longitudeError: ''
    };
    this.handleAddPlace = this.handleAddPlace.bind(this);
  }

  handleAddPlace() {
    const { title, address } = this.state;
    let titleError = '';
    let addressError = '';
    if (!title) {
      titleError = 'Name is required.';
    }
    if (!address) {
      addressError = 'Address is required.';
    }
    this.setState({
      titleError,
      addressError
    });

    const isError = titleError || addressError;
    if (!isError) {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.address}&key=AIzaSyBCPfaR4w1Bgm5B4CrrYISWqx0BqsmKEsw`)
      .then((response) => {
        console.log('coords =======>' + response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng);
        this.props.onAddPlace({
          title,
          latitude: parseFloat(response.data.results[0].geometry.location.lat),
          longitude: parseFloat(response.data.results[0].geometry.location.lng)
        });
      })
      AlertIOS.alert(
        'Place added',
        'Your place is added to the map. Click on the Favorites tab to view.'
      );

    dismissKeyboard();
    }
  }

  render() {
    //form for adding a new location to favorites
    return (
      <View style={styles.view}>
        <Text style={styles.text}>Name</Text>
        <TextInput
          style={styles.textInput}
          value={this.state.title}
          onChangeText={(title) => this.setState({ title })}>
        </TextInput>
        <Error message={this.state.titleError} />
        <Text style={styles.text}>Address</Text>
        <TextInput
          keyboardType="numbers-and-punctuation"
          style={styles.textInput}
          onChangeText={(address) => this.setState({ address })}></TextInput>
        <Error message={this.state.addressError} />
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.handleAddPlace()}>
          <Text style={styles.buttonText}>Add Place</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

//define the error messages when no data is entered into the input fields
const Error = (props) => {
  return (
    <Text style={styles.error}>{props.message}</Text>
  );
}

const styles = StyleSheet.create({
  view: {
    paddingTop: 50,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#fed',
    flex: 1
  },
  text: {
    color: '#333333',
    marginBottom: 5
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5
  },
  button: {
    backgroundColor: '#ff7f50',
    padding: 12,
    borderRadius: 6
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
