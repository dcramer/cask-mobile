import React from 'react';
import PropTypes from 'prop-types';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Activity from './screens/Activity';
import CheckIn from './screens/CheckIn';
import CheckInLocation from './screens/CheckInLocation';
import Notifications from './screens/Notifications';
import Home from './screens/Home';
import Profile from './screens/Profile';
import BottleDetails from './screens/BottleDetails';
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
          iconName = `ios-home${!focused ? '-outline' : ''}`;
        } else if (routeName === 'Activity') {
          iconName = `ios-map${!focused ? '-outline' : ''}`;
        } else if (routeName === 'Notifications') {
          iconName = `ios-notifications${!focused ? '-outline' : ''}`;
        } else if (routeName === 'Profile') {
          iconName = `ios-contact${!focused ? '-outline' : ''}`;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
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

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    CheckInLocation: {
      screen: CheckInLocation,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export const createRootNavigator = () => {
  return RootStack;
};
