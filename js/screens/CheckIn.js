import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Slider } from 'react-native-elements';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, margins } from '../styles';
import Bottle from '../components/Bottle';
import Card from '../components/Card';
import FormLabel from '../components/FormLabel';
import PersonList from '../components/PersonList';
import TagList from '../components/TagList';

const flavorProfileDatabase = [
  { label: 'Bold', value: 'Bold' },
  { label: 'Peaty', value: 'Peaty' },
  { label: 'Wood', value: 'Wood' },
  { label: 'Fire', value: 'Fire' },
  { label: 'Apple Pie', value: 'Apple Pie' },
];

class CheckInRating extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = { value: 0 };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    let value = this.state.value;
    if (value) {
      value = value.toFixed(2);
    }
    return (
      <Card>
        <View style={styles.labelContainer}>
          <View style={styles.labelLeft}>
            <FormLabel>Rating</FormLabel>
          </View>
          <View style={styles.labelRight}>
            <Text style={value ? styles.ratingTextPresent : styles.ratingTextNone}>
              {value || 'Not Rated'}
            </Text>
          </View>
        </View>
        <Slider
          step={0.25}
          minimumValue={0}
          maximumValue={5}
          value={this.state.value}
          style={styles.ratingSlider}
          minimumTrackTintColor={colors.trim}
          maximumTrackTintColor={colors.trim}
          thumbTintColor={colors.primary}
          onValueChange={this.setValue}
        />
      </Card>
    );
  }
}

class CheckInNotes extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = { value: '' };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    return (
      <Card>
        <FormLabel>Tasting Notes</FormLabel>
        <TextInput
          placeholder="How was it?"
          placeholderTextColor={colors.light}
          style={styles.textInput}
          value={this.state.value}
          onChangeText={this.setValue}
        />
      </Card>
    );
  }
}

class CheckInFriends extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = { value: null };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    let { navigation } = this.props;
    let { value } = this.state;
    return (
      <Card style={styles.formElementContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FriendSelect', {
              currentValue: value,
              onChangeValue: this.setValue,
            })
          }>
          <View style={styles.labelContainer}>
            <View style={styles.labelLeft}>
              <FormLabel>Tag Friends</FormLabel>
            </View>
            <View style={styles.labelRight}>
              {value && <PersonList personList={value} style={styles.friendList} />}
              <Ionicons name="ios-arrow-forward" size={18} color={colors.default} />
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  }
}

class CheckInLocation extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = { value: null };
  }

  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    let { navigation } = this.props;
    let { value } = this.state;
    return (
      <Card style={styles.formElementContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('LocationSelect', {
              currentValue: value,
              onComplete: this.setValue,
            })
          }>
          <View style={styles.labelContainer}>
            <View style={styles.labelLeft}>
              <FormLabel>Location</FormLabel>
            </View>
            <View style={styles.labelRight}>
              <Ionicons name="ios-arrow-forward" size={18} color={colors.default} />
            </View>
          </View>
        </TouchableOpacity>
        {value && <Text>{value.name}</Text>}
      </Card>
    );
  }
}

class CheckInFlavorProfile extends Component {
  constructor(...args) {
    super(...args);
    this.state = { value: new Set() };
  }
  setValue = value => {
    this.setState({ value });
    this.props.onChangeValue(value);
  };

  render() {
    let { navigation } = this.props;
    return (
      <Card style={styles.formElementContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FlavorProfileSelect', {
              currentValue: this.state.value,
              onChangeValue: this.setValue,
            })
          }>
          <View style={styles.labelContainer}>
            <View style={styles.labelLeft}>
              <FormLabel>Flavor Profile</FormLabel>
            </View>
            <View style={styles.labelRight}>
              <Ionicons name="ios-arrow-forward" size={18} color={colors.default} />
            </View>
          </View>
        </TouchableOpacity>
        <TagList
          tagList={flavorProfileDatabase}
          style={styles.tagSelect}
          value={this.state.value}
          onChangeValue={this.setValue}
        />
      </Card>
    );
  }
}

export default class CheckIn extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      notes: '',
      rating: 0,
      friends: [],
      location: null,
      flavorProfile: null,
    };
  }

  onChangeValue = (name, value) => {
    this.setState({ [name]: value });
  };

  onCheckIn = () => {};

  isValid = () => {
    return true;
  };

  render() {
    let { navigation } = this.props;
    let { bottle } = navigation.state.params;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Bottle navigation={this.props.navigation} bottle={bottle} />
        <CheckInNotes onChangeValue={v => this.onChangeValue('notes', v)} navigation={navigation} />
        <CheckInRating
          onChangeValue={v => this.onChangeValue('rating', v)}
          navigation={navigation}
        />
        <CheckInFriends
          onChangeValue={v => this.onChangeValue('friends', v)}
          navigation={navigation}
        />
        <CheckInLocation
          onChangeValue={v => this.onChangeValue('location', v)}
          navigation={navigation}
        />
        <CheckInFlavorProfile
          onChangeValue={v => this.onChangeValue('flavorProfile', v)}
          navigation={navigation}
        />
        <Button
          title="Confirm Check-in"
          onPress={this.onCheckIn}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={[styles.button, this.isValid() && styles.buttonPrimary]}
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
    marginTop: margins.full,
    marginBottom: margins.full,
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  formElementContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
  },
  labelLeft: {
    flex: 1,
    alignSelf: 'stretch',
  },
  labelRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: margins.half,
    marginBottom: margins.half,
  },
  friendList: {
    marginRight: margins.half,
  },
  ratingTextPresent: {
    color: colors.default,
  },
  ratingTextNone: {
    color: colors.light,
  },
  ratingSlider: {
    marginTop: margins.half,
    marginBottom: margins.half,
  },
  textInput: {
    marginTop: margins.half,
    marginBottom: margins.half,
  },
  tagSelect: {
    marginTop: margins.half,
    marginBottom: margins.half,
  },
});
