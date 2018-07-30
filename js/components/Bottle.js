import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View } from 'react-native';

import AgedPropTypes from '../propTypes';

export default class Bottle extends Component {
  static propTypes = {
    bottle: AgedPropTypes.Bottle.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  static getBottleName = bottle => {
    if (!!bottle.name) return bottle.name;
    return `${bottle.distillery} ${bottle.statedAge || ''}`;
  };

  render() {
    let { bottle } = this.props;
    return (
      <View style={styles.rowContainer}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    height: 100,
    padding: 10,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#CCC',
    shadowOpacity: 1.0,
    shadowRadius: 1,
  },
  name: {
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
  },
  distillery: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: '#777',
  },
  category: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: '#777',
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
