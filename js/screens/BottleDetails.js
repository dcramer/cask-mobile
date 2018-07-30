import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';

export default class BottleDetails extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  getBottleName(item) {
    if (!!item.name) return item.name;
    return `${item.distillery} ${item.statedAge || ''}`;
  }

  render() {
    let { item } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="contain" />
          <View style={styles.rowText}>
            <Text style={styles.name} numberOfLines={2} ellipsizeMode={'tail'}>
              {this.getBottleName(item)} {!!item.series && item.series}
            </Text>
            <Text style={styles.distillery} numberOfLines={1} ellipsizeMode={'tail'}>
              {item.distillery}
            </Text>
            <Text style={styles.category} numberOfLines={1} ellipsizeMode={'tail'}>
              {item.category}
            </Text>
          </View>
        </View>
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
  rowText: {
    flex: 4,
    flexDirection: 'column',
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
});
