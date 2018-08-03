import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { colors, margins } from '../styles';
import CustomPropTypes from '../propTypes';
import Bottle from './Bottle';
import Card from './Card';

class CheckIn extends Component {
  static propTypes = {
    checkIn: CustomPropTypes.CheckIn.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  render() {
    let { bottle } = this.props.checkIn;
    return <Bottle bottle={bottle} />;
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingTop: margins.full,
    paddingBottom: margins.full,
  },
  name: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.default,
  },
  distillery: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: colors.default,
  },
  category: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: colors.default,
  },
  thumbnail: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  rowText: {
    flex: 4,
    flexDirection: 'column',
  },
});

export default withNavigation(CheckIn);
