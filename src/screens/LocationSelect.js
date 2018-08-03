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
    onPress: PropTypes.func.isRequired,
  };

  render() {
    let { location, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Card>
          <Text>{location.name}</Text>
        </Card>
      </TouchableOpacity>
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

  async componentWillMount() {
    let { navigation } = this.props;
    let { title, onChangeValue } = navigation.state.params;
    if (!title || !onChangeValue) navigation.goBack(null);
  }

  onSelect = value => {
    let { navigation } = this.props;
    navigation.state.params.onChangeValue(value);
    navigation.goBack();
  };

  _renderItem = ({ item }) => <LocationEntry location={item} onPress={() => this.onSelect(item)} />;

  _keyExtractor = item => item.id;

  render() {
    let { navigation } = this.props;
    let { title } = navigation.state.params;
    return (
      <View style={styles.container}>
        <ModalHeader title={title} />
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
        <FlatList
          data={locationDatabase}
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
