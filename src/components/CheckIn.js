import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, Image, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import TimeAgo from 'react-native-timeago';

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
    let { checkIn } = this.props;
    let { bottle, location, user } = checkIn;
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
            <View style={styles.rowOne}>
              <Text style={styles.user} numberOfLines={2} ellipsizeMode={'tail'}>
                {user.displayName}
              </Text>
              <Text style={styles.timestamp}>
                <TimeAgo time={checkIn.createdAt.toDate()} />
              </Text>
            </View>
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
    flex: 1,
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
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowOne: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timestamp: {
    color: colors.light,
    fontSize: 12,
  },
});

export default withNavigation(CheckIn);
