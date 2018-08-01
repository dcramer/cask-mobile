import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { layout, margins } from '../styles';

class ModalHeader extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
    onDone: PropTypes.func,
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text style={[styles.action, styles.leftAction]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.text}>{this.props.title}</Text>
        <TouchableOpacity onPress={this.props.onDone}>
          <Text style={[styles.action, styles.rightAction]}>
            {!!this.props.onDone ? 'Save' : ''}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7b6be6',
    paddingTop: layout.statusBarHeight,
    paddingBottom: margins.half,
  },
  action: {
    color: '#fff',
    fontSize: 14,
    flex: 0,
    width: 100,
    paddingRight: margins.threeQuarter,
    paddingLeft: margins.threeQuarter,
  },
  rightAction: {
    textAlign: 'right',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
  },
});

export default withNavigation(ModalHeader);
