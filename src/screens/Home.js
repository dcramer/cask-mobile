import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';

import { layout } from '../styles';
import CustomPropTypes from '../propTypes';
import Bottle from '../components/Bottle';

const whiskyDatabase = [
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
];

class BottleEntry extends Component {
  static propTypes = {
    bottle: CustomPropTypes.Bottle.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  _onPress = () => {
    let { bottle, navigation } = this.props;
    navigation.navigate('BottleDetails', { id: bottle.id, bottle });
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Bottle {...this.props} />
      </TouchableOpacity>
    );
  }
}

class RecentActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: whiskyDatabase.slice(2, 4),
    };
  }

  _renderItem = ({ item }) => <BottleEntry bottle={item} navigation={this.props.navigation} />;

  _keyExtractor = item => item.id;

  render() {
    return (
      <View>
        <FlatList
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

class SearchResults extends Component {
  _renderItem = ({ item }) => <BottleEntry bottle={item} navigation={this.props.navigation} />;

  _keyExtractor = item => item.id;

  render() {
    let results =
      this.props.query && whiskyDatabase.filter(i => i.name.indexOf(this.props.query) !== -1);
    return (
      <View>
        {this.props.query ? (
          <FlatList
            data={results}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        ) : (
          <Text>Type something!</Text>
        )}
      </View>
    );
  }
}

export default class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    this.state = { searchActive: false, searchQuery: null };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            placeholder="bottle, distillery, style"
            lightTheme
            onFocus={() => this.setState({ searchActive: true })}
            onBlur={() => this.setState({ searchActive: false })}
            onChangeText={text => this.setState({ searchQuery: text })}
            onClearText={text => this.setState({ searchQuery: text })}
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
          />
        </View>
        {this.state.searchActive || !!this.state.searchQuery ? (
          <SearchResults query={this.state.searchQuery} navigation={this.props.navigation} />
        ) : (
          <RecentActivity navigation={this.props.navigation} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    backgroundColor: '#7b6be6',
    paddingTop: layout.statusBarHeight,
  },
  searchContainer: {
    backgroundColor: '#7b6be6',
    borderTopWidth: 0,
  },
  searchInput: {
    color: '#000',
    backgroundColor: '#eee',
  },
});
