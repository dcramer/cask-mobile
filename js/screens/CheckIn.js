import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormLabel, FormInput, FormValidationMessage, Slider } from 'react-native-elements';
import { ScrollView, StyleSheet, View } from 'react-native';

import Bottle from '../components/Bottle';

class CheckInRating extends Component {
  constructor(...args) {
    super(...args);
    this.state = { rating: 0 };
  }

  render() {
    return (
      <View style={styles.formElementContainer}>
        <FormLabel>Rating {this.state.rating || 'No Rating'}</FormLabel>
        <Slider
          step={0.25}
          minimumValue={0}
          maximumValue={5}
          value={this.state.rating}
          style={styles.ratingContainer}
          thumbTintColor="#7b6be6"
          onValueChange={rating => this.setState({ rating })}
        />
      </View>
    );
  }
}

class CheckInNotes extends Component {
  render() {
    return (
      <View style={styles.formElementContainer}>
        <FormLabel>Tasting Notes</FormLabel>
        <FormInput />
      </View>
    );
  }
}

class CheckInFriends extends Component {
  render() {
    return (
      <View style={styles.formElementContainer}>
        <FormLabel>Tag Friends</FormLabel>
      </View>
    );
  }
}

class CheckInLocation extends Component {
  render() {
    return (
      <View style={styles.formElementContainer}>
        <FormLabel>Location</FormLabel>
      </View>
    );
  }
}

class CheckInFlavorProfile extends Component {
  render() {
    return (
      <View style={styles.formElementContainer}>
        <FormLabel>Flavor Profile</FormLabel>
      </View>
    );
  }
}

export default class CheckIn extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    let { bottle } = this.props.navigation.state.params;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Bottle navigation={this.props.navigation} bottle={bottle} />
        <CheckInNotes />
        <CheckInRating />
        <CheckInFriends />
        <CheckInLocation />
        <CheckInFlavorProfile />
        <Button
          title="Confirm Check-in"
          onPress={this._onCheckIn}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    padding: 10,
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
  },
  ratingContainer: {
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'stretch',
  },
  formElementContainer: {
    alignSelf: 'stretch',
  },
  ratingThumbStyle: {
    color: '#7b6be6',
  },
});
