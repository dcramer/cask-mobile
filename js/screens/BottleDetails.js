import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { StyleSheet, ScrollView } from 'react-native';

import Bottle from '../components/Bottle';

export default class BottleDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    let { bottle } = navigation.state.params;
    return {
      title: Bottle.getBottleName(bottle),
    };
  };

  _onCheckIn = () => {
    let { navigation } = this.props;
    let { bottle } = navigation.state.params;
    navigation.navigate('CheckIn', { id: bottle.id, bottle });
  };

  render() {
    let { navigation } = this.props;
    let { bottle } = navigation.state.params;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Bottle navigation={navigation} bottle={bottle} />
        <Button
          title="Check-in"
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
    alignSelf: 'stretch',
    padding: 10,
  },
  button: {
    alignSelf: 'stretch',
  },
});
