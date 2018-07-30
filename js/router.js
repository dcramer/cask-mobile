import React from 'react';
import PropTypes from 'prop-types';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Activity from './screens/Activity';
import Shelf from './screens/Shelf';
import Profile from './screens/Profile';
import EditCellarItem from './screens/EditCellarItem';

// let screen = Dimensions.get('window');

export const Tabs = createBottomTabNavigator(
  {
    Activity,
    Shelf,
    Profile,
  },
  {
    initialRouteName: 'Shelf',
    navigationOptions: ({ navigation }) => {
      const TabBarIcon = ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Shelf') {
          iconName = `ios-add-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Activity') {
          iconName = `ios-map${focused ? '' : '-outline'}`;
        } else if (routeName === 'Profile') {
          iconName = `ios-person${focused ? '' : '-outline'}`;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      };

      TabBarIcon.propTypes = {
        focused: PropTypes.boolean,
        tintColor: PropTypes.string,
      };

      return {
        tabBarIcon: TabBarIcon,
        tabBarOptions: {
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        },
      };
    },
  }
);

export const ShelfStack = createStackNavigator({
  Shelf: {
    screen: Shelf,
    navigationOptions: { title: 'Shelf' },
  },
  EditCellarItem: {
    screen: EditCellarItem,
    navigationOptions: ({ navigation }) => ({
      header: null,
      tabBarVisible: false,
      gesturesEnabled: false,
    }),
  },
});

export const createRootNavigator = () => {
  return createStackNavigator(
    {
      Tabs: {
        screen: Tabs,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
      ShelfStack: {
        screen: ShelfStack,
        navigationOptions: {
          gesturesEnabled: false,
        },
      },
    },
    {}
  );
};
