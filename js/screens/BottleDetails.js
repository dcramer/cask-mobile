import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Bottle from '../components/Bottle';

export default class BottleDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    let { item } = navigation.state.params;
    return {
      title: BottleDetails.getBottleName(item),
    };
  };

  static getBottleName(item) {
    if (!!item.name) return item.name;
    return `${item.distillery} ${item.statedAge || ''}`;
  }

  render() {
    let { item } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <Bottle navigation={this.props.navigation} item={item} />
        <Button
          title="Check-in"
          onPress={this.checkIn}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
      </View>
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
    flexDirection: 'row',
    padding: 10,
  },
  button: {
    flexDirection: 'row',
  },
});
