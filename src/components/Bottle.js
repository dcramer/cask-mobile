import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View, ViewPropTypes } from 'react-native';
import { withNavigation } from 'react-navigation';

import { colors, margins } from '../styles';
import CustomPropTypes from '../propTypes';
import Card from './Card';

class Bottle extends Component {
  static propTypes = {
    bottle: CustomPropTypes.Bottle.isRequired,
    navigation: PropTypes.object.isRequired,
    style: ViewPropTypes.style,
  };

  static getBottleName = bottle => {
    if (!!bottle.name) return bottle.name;
    return `${bottle.distillery} ${bottle.statedAge || ''}`;
  };

  render() {
    let { bottle, style } = this.props;
    return (
      <Card style={[styles.cardContainer, style]}>
        <Image source={{ uri: bottle.thumbnail }} style={styles.thumbnail} resizeMode="contain" />
        <View style={styles.rowText}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode={'tail'}>
            {Bottle.getBottleName(bottle)} {!!bottle.series && bottle.series}
          </Text>
          <Text style={styles.distillery} numberOfLines={1} ellipsizeMode={'tail'}>
            {bottle.distillery}
          </Text>
          <Text style={styles.category} numberOfLines={1} ellipsizeMode={'tail'}>
            {bottle.category} {!!bottle.statedAge && `${bottle.statedAge} yo`}
          </Text>
        </View>
      </Card>
    );
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

export default withNavigation(Bottle);
