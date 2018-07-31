import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import { colors, margins } from '../styles';
import Card from '../components/Card';
import FormLabel from '../components/FormLabel';
import TagList from '../components/TagList';
import ModalHeader from '../components/ModalHeader';

const flavorProfileDatabase = [
  { label: 'Bold', value: 'Bold' },
  { label: 'Peaty', value: 'Peaty' },
  { label: 'Wood', value: 'Wood' },
  { label: 'Fire', value: 'Fire' },
  { label: 'Apple Pie', value: 'Apple Pie' },
];

class FlavorProfileSelect extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    let { navigation } = this.props;
    let { currentValue } = navigation.state.params;
    this.state = {
      query: '',
      selected: new Set(currentValue),
    };
  }

  setValue = selected => {
    this.setState({ selected });
  };

  onDone = () => {
    let { navigation } = this.props;
    let { selected } = this.state;
    navigation.state.params.onChangeValue(selected);
    navigation.goBack();
  };

  render() {
    let results = flavorProfileDatabase
      .filter(i => i.label.indexOf(this.state.query) !== -1)
      .sort((a, b) => a.label > b.label);
    return (
      <ScrollView style={styles.container}>
        <ModalHeader onDone={this.onDone} title="Flavor Profile" />
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
        {this.state.selected.size && (
          <Card>
            <FormLabel>Selected</FormLabel>
            <TagList
              tagList={Array.from(this.state.selected)
                .sort()
                .map(value => {
                  return flavorProfileDatabase.find(p => p.value === value);
                })}
              style={styles.tagSelect}
              value={this.state.selected}
              onChangeValue={this.setValue}
            />
          </Card>
        )}
        <Card>
          <FormLabel>All Tags</FormLabel>
          <TagList
            tagList={results}
            style={styles.tagSelect}
            value={this.state.selected}
            onChangeValue={this.setValue}
          />
        </Card>
      </ScrollView>
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

export default withNavigation(FlavorProfileSelect);
