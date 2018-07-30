import React, { Component } from 'react';
import { StatusBar, StyleSheet, FlatList, Text, View } from 'react-native';

import CellarItem from '../components/CellarItem';

export default class Shelf extends Component {
  static navigationOptions = {
    title: 'Shelf',
  };

  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          id: '1',
          name: 'Balmenach 1982 JM',
          distillery: 'Balmenach',
          category: 'Single Malt',
          abv: '65.9',
          statedAge: null,
          vintageYear: null,
          bottleYear: null,
          caskType: null,
          thumbnail: 'https://covers.openlibrary.org/w/id/7984916-M.jpg',
        },
        {
          id: '2',
          name: 'Balmenach 21-year-old MoM',
          distillery: 'Balmenach',
          category: 'Single Malt',
          abv: '43.0',
          statedAge: 21,
          vintageYear: null,
          bottleYear: null,
          caskType: null,
          thumbnail: 'https://covers.openlibrary.org/w/id/7984916-M.jpg',
        },
        {
          id: '3',
          name: 'Laphroaig 1967 RWD',
          distillery: 'Laphroaig',
          category: 'Single Malt',
          abv: '57.0',
          statedAge: 15,
          vintageYear: 1967,
          bottleYear: 1982,
          caskType: 'Sherry Cask',
          thumbnail: 'https://covers.openlibrary.org/w/id/7984916-M.jpg',
        },
      ],
    };
  }

  _renderItem = ({ item }) => <CellarItem item={item} />;

  _keyExtractor = item => item.id;

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FlatList
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
