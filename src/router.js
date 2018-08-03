import React from 'react';
import PropTypes from 'prop-types';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import Activity from './screens/Activity';
import AddBottle from './screens/AddBottle';
import CheckIn from './screens/CheckIn';
import FriendSelect from './screens/FriendSelect';
import LocationSelect from './screens/LocationSelect';
import Notifications from './screens/Notifications';
import Home from './screens/Home';
import Profile from './screens/Profile';
import BottleDetails from './screens/BottleDetails';
import TagSelect from './screens/TagSelect';
import Welcome from './screens/Welcome';

import { colors } from './styles';

const commonOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
    borderBottomColor: colors.trim,
    borderBottomWidth: 1,
  },
  headerTintColor: colors.background,
  headerTitleStyle: {
    color: colors.background,
    fontWeight: 'bold',
  },
  headerBackTitleStyle: {
    color: colors.background,
  },
  headerLeftTitleStyle: {
    color: colors.background,
  },
  headerRightTitleStyle: {
    color: colors.background,
  },
};

const HomeStack = createStackNavigator(
  {
    Home,
    BottleDetails,
    CheckIn,
    AddBottle,
  },
  {
    navigationOptions: { ...commonOptions },
  }
);

const MainStack = createBottomTabNavigator(
  {
    HomeStack,
    Activity,
    Notifications,
    Profile,
  },
  {
    initialRouteName: 'HomeStack',
    navigationOptions: ({ navigation }) => {
      const TabBarIcon = ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'HomeStack') {
          iconName = `ios-home`;
        } else if (routeName === 'Activity') {
          iconName = `ios-map`;
        } else if (routeName === 'Notifications') {
          iconName = `ios-notifications`;
        } else if (routeName === 'Profile') {
          iconName = `ios-contact`;
        }
        return <Icon name={iconName} size={25} color={tintColor} />;
      };

      TabBarIcon.propTypes = {
        focused: PropTypes.boolean,
        tintColor: PropTypes.string,
      };

      return {
        tabBarIcon: TabBarIcon,
        tabBarOptions: {
          showLabel: false,
          activeTintColor: colors.primary,
          inactiveTintColor: colors.default,
          style: {
            borderTopColor: colors.trim,
            borderTopWidth: 1,
            backgroundColor: colors.background,
          },
        },
        ...commonOptions,
      };
    },
  }
);

export const RootNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    LocationSelect,
    FriendSelect,
    TagSelect,
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: ({ navigation }) => ({
      ...commonOptions,
      tabBarVisible: navigation.state.index === 0,
    }),
  }
);

export const UnauthenticatedNavigator = createStackNavigator(
  {
    Welcome,
  },
  {
    navigationOptions: { ...commonOptions },
  }
);
