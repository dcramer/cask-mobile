import React, { Component } from 'react';
import { StatusBar, StyleSheet, FlatList, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Bottle from '../components/Bottle';

class CheckinHeader extends React.Component {
  render() {
    return <TextInput />;
  }
}

export default class Shelf extends Component {
  static navigationOptions = {
    headerTitle: <CheckinHeader />,
    headerRight: <Ionicons name="ios-barcode" size={25} color="gray" />,
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
        },
        {
          id: '2',
          name: 'Balmenach 21-year-old MoM',
          distillery: 'Balmenach',
          category: 'Single Malt',
          abv: '43.0',
          statedAge: 21,
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
          thumbnail: 'https://static.whiskybase.com/storage/whiskies/2/4/413/70765-small.png',
        },
        {
          id: '4',
          name: 'Bowmore 1956',
          distillery: 'Bowmore',
          category: 'Single Malt',
          series: 'Islay Pure Malt',
          abv: '43.0',
          vintageYear: 1956,
          caskType: 'Shery Cask',
          thumbnail: 'https://static.whiskybase.com/storage/whiskies/9/3/129/147563-small.png',
        },
        {
          id: '5',
          name: 'Ardbeg 1976',
          distillery: 'Ardbeg',
          category: 'Single Malt',
          series: 'Feis Ile 2002',
          abv: '53.1',
          statedAge: 25,
          vintageYear: 1976,
          caskNumber: 2390,
          caskType: 'Shery Butt',
          thumbnail: 'https://static.whiskybase.com/storage/whiskies/1/3/07/81452-small.png',
        },
      ],
    };
  }

  _renderItem = ({ item }) => <Bottle item={item} navigation={this.props.navigation} />;

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
