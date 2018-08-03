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
    let { bottle, location, user } = this.props.checkIn;
    return (
      <Card style={styles.cardContainer}>
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://pbs.twimg.com/profile_images/865686039192416257/94eEB9RO_400x400.jpg',
            }}
            style={styles.thumbnail}
            resizeMode="contain"
          />
          <View style={styles.rowText}>
            <Text style={styles.user} numberOfLines={2} ellipsizeMode={'tail'}>
              {user.displayName}
            </Text>
            {!!location && (
              <Text style={styles.location} numberOfLines={1} ellipsizeMode={'tail'}>
                {location.name}
              </Text>
            )}
          </View>
        </View>
        <Bottle bottle={bottle} style={styles.bottleCard} />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: margins.half,
    marginBottom: margins.full,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.trim,
  },
  bottleCard: {
    borderWidth: 1,
    borderColor: colors.trim,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: margins.half,
  },
  user: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.default,
  },
  location: {
    paddingLeft: 10,
    marginTop: 5,
    fontSize: 14,
    color: colors.default,
  },
  thumbnail: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  rowText: {
    flex: 1,
    alignSelf: 'center',
  },
});

export default withNavigation(CheckIn);
