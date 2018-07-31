import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Constants } from 'expo';
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';

const locationDatabase = [
  {
    id: '1',
    name: 'Sentry HQ',
  },
  {
    id: '2',
    name: 'The Pot Still',
  },
  {
    id: '3',
    name: 'Bourbon and Branch',
  },
];

class LocationEntry extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  _onPress = () => {
    let { location, navigation } = this.props;
    navigation.getParam('onComplete')(location);
    navigation.goBack();
  };

  render() {
    let { location } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Text>{location.name}</Text>
      </TouchableOpacity>
    );
  }
}

class SearchResults extends Component {
  _renderItem = ({ item }) => <LocationEntry location={item} navigation={this.props.navigation} />;

  _keyExtractor = item => item.id;

  render() {
    let results = locationDatabase.filter(i => i.name.indexOf(this.props.query) !== -1);
    return (
      <View>
        <FlatList data={results} keyExtractor={this._keyExtractor} renderItem={this._renderItem} />
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
    this.state = { searchActive: false, searchQuery: '' };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            lightTheme
            onFocus={() => this.setState({ searchActive: true })}
            onBlur={() => this.setState({ searchActive: false })}
            onChangeText={text => this.setState({ searchQuery: text })}
            onClearText={text => this.setState({ searchQuery: text })}
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
          />
        </View>
        <SearchResults query={this.state.searchQuery} navigation={this.props.navigation} />
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
    paddingTop: Constants.statusBarHeight,
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
