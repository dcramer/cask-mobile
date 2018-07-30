import React from 'react';
import PropTypes from 'prop-types';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Activity from './screens/Activity';
import Shelf from './screens/Shelf';
import Profile from './screens/Profile';
import EditCellarItem from './screens/EditCellarItem';

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
          activeTintColor: 'purple',
          inactiveTintColor: 'gray',
          style: {
            borderTopColor: '#dddddd',
            borderTopWidth: 1,
            backgroundColor: 'white',
          },
        },
      };
    },
  }
);

export const ShelfStack = createStackNavigator({
  Shelf,
  EditCellarItem,
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
    {
      initialRouteName: 'Tabs',
      navigationOptions: {
        headerStyle: {
          backgroundColor: 'white',
          borderBottomColor: '#dddddd',
          borderBottomWidth: 1,
        },
        headerTintColor: 'purple',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      },
    }
  );
};
