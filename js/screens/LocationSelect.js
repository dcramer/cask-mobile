import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import Card from '../components/Card';
import ModalHeader from '../components/ModalHeader';

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
        <Card>
          <Text>{location.name}</Text>
        </Card>
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

class LocationSelect extends Component {
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
        <ModalHeader title="Select Location" />
        <View style={styles.search}>
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
  search: {
    backgroundColor: '#7b6be6',
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

export default withNavigation(LocationSelect);
