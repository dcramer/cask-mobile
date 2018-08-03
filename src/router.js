import React from 'react';
import PropTypes from 'prop-types';
import idx from 'idx';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Activity from './screens/Activity';
import AddBottle from './screens/AddBottle';
import AddDistillery from './screens/AddDistillery';
import CheckIn from './screens/CheckIn';
import DistillerySelect from './screens/DistillerySelect';
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
};

const HomeStack = createStackNavigator(
  {
    Home,
    BottleDetails,
    CheckIn,
    AddBottle,
    AddDistillery,
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
      const { routeName } = navigation.state;
      const TabBarIcon = ({ focused, tintColor }) => {
        let iconName;
        if (routeName === 'HomeStack') {
          iconName = `home`;
        } else if (routeName === 'Activity') {
          iconName = `map`;
        } else if (routeName === 'Notifications') {
          iconName = `bell`;
        } else if (routeName === 'Profile') {
          iconName = `user`;
        }
        return <Icon name={iconName} size={24} color={tintColor} solid={focused} />;
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
    DistillerySelect,
    LocationSelect,
    FriendSelect,
    TagSelect,
  },
  {
    mode: 'modal',
    gesturesEnabled: true,
    // XXX(dcramer):
    navigationOptions: ({ navigation }) => {
      let focusedRouteName = idx(navigation, _ => _.state.routes[_.state.index].routeName);
      let header,
        title = null;
      switch (focusedRouteName) {
        case 'HomeStack':
          header = null;
          break;
        case 'Activity':
          title = 'Activity';
          break;
        case 'Notifications':
          title = 'Notifications';
          break;
        case 'Profile':
          header = null;
          break;
      }

      return {
        ...commonOptions,
        header: header,
        title: title,
        tabBarVisible: navigation.state.index === 0,
      };
    },
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
