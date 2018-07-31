import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Constants } from 'expo';
import { Image, StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, margins } from '../styles';
import Card from '../components/Card';
import ModalHeader from '../components/ModalHeader';

const friendDatabase = [
  {
    id: '1',
    name: 'George Clooney',
    username: 'georgeboy',
    avatarUrl: 'https://pbs.twimg.com/profile_images/939142405994954752/R8cf4OM-_400x400.jpg',
  },
  {
    id: '2',
    name: 'Voltron',
    username: 'voltron76',
    avatarUrl: 'https://pbs.twimg.com/profile_images/865686039192416257/94eEB9RO_400x400.jpg',
  },
  {
    id: '3',
    name: 'Jane Doe',
    username: 'jane_doe',
    avatarUrl: 'https://pbs.twimg.com/profile_images/964223499857547264/6V5MaYjo_400x400.jpg',
  },
  {
    id: '4',
    name: 'David Cramer',
    username: 'zeeg',
    avatarUrl: 'https://pbs.twimg.com/profile_images/812188242229403648/M9G7BbXy_400x400.jpg',
  },
];

class PersonEntry extends Component {
  static propTypes = {
    person: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onPress: PropTypes.func,
  };

  render() {
    let { person, onPress, selected } = this.props;
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <Card style={styles.cardContainer}>
          <Image source={{ uri: person.avatarUrl }} style={styles.avatar} resizeMode="contain" />
          <View style={styles.rowText}>
            <Text style={styles.name} ellipsizeMode={'tail'}>
              {person.name}
            </Text>
            <Text style={styles.username} ellipsizeMode={'tail'}>
              {person.username}
            </Text>
          </View>
          <Ionicons
            name={`ios-${selected ? 'checkmark-circle' : 'radio-button-off'}`}
            size={24}
            color={selected ? colors.primary : colors.default}
          />
        </Card>
      </TouchableOpacity>
    );
  }
}

class FriendSelect extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    let { currentValue } = navigation.state.params;
    this.state = {
      query: '',
      selected: new Set(currentValue ? currentValue.map(i => i.id) : null),
    };
  }
  _renderItem = ({ item }) => (
    <PersonEntry
      person={item}
      navigation={this.props.navigation}
      selected={this.state.selected.has(item.id)}
      onPress={() => this.onPressPerson(item.id)}
    />
  );

  _keyExtractor = item => item.id;

  onPressPerson = value => {
    let selected = new Set(this.state.selected);
    if (selected.has(value)) {
      selected.delete(value);
    } else {
      selected.add(value);
    }
    this.setState({ selected });
  };

  onDone = () => {
    let { navigation } = this.props;
    let { selected } = this.state;
    navigation.state.params.onChangeValue(
      Array.from(selected).map(personId => {
        return friendDatabase.find(p => p.id === personId);
      })
    );
    navigation.goBack();
  };

  render() {
    let results = friendDatabase.filter(i => i.name.indexOf(this.state.query) !== -1);
    return (
      <View style={styles.container}>
        <ModalHeader onDone={this.onDone} title="Tag Friends" />
        <View style={styles.search}>
          <SearchBar
            lightTheme
            onChangeText={text => this.setState({ query: text })}
            onClearText={text => this.setState({ query: text })}
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
            placeholder="Search"
          />
        </View>
        <FlatList data={results} keyExtractor={this._keyExtractor} renderItem={this._renderItem} />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b6be6',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#7b6be6',
    borderTopWidth: 0,
  },
  searchInput: {
    color: '#000',
    fontSize: 14,
    backgroundColor: '#eee',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: margins.full,
    paddingBottom: margins.full,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
  },
  username: {
    flex: 1,
    fontSize: 14,
    color: colors.default,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  rowText: {
    paddingLeft: 10,
    flex: 4,
    flexDirection: 'column',
  },
});

export default withNavigation(FriendSelect);
