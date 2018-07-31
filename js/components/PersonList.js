import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View, ViewPropTypes } from 'react-native';

import { colors, margins } from '../styles';

class PersonItem extends Component {
  static propTypes = {
    person: PropTypes.shape({
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    style: ViewPropTypes.style,
  };

  render() {
    let props = this.props;
    return (
      <View style={[styles.listItem, props.style]}>
        <Image
          source={{ uri: props.person.avatarUrl }}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>
    );
  }
}

export default class PersonList extends Component {
  static propTypes = {
    personList: PropTypes.arrayOf(
      PropTypes.shape({
        avatarUrl: PropTypes.string.isRequired,
      })
    ).isRequired,
    style: ViewPropTypes.style,
  };

  render() {
    return (
      <View style={[styles.listContainer, this.props.style]}>
        {this.props.personList.map(person => (
          <PersonItem person={person} key={person.id} />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  listItem: {
    marginRight: margins.quarter,
  },
  avatar: {
    height: 22,
    width: 22,
    borderRadius: 11,
  },
});
