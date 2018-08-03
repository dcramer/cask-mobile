import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Sentry } from 'react-native-sentry';

import { db } from '../firebase';
import AlertCard from '../components/AlertCard';
import Card from '../components/Card';
import ModalHeader from '../components/ModalHeader';
import LoadingIndicator from '../components/LoadingIndicator';

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, error: null, items: [] };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchData();
    }
  }

  fetchData = () => {
    let { query } = this.props;
    this.setState({ loading: true });
    db.collection('distilleries')
      .where('name', '>=', query || '')
      .orderBy('name')
      .limit(25)
      .get()
      .then(snapshot => {
        this.setState({
          loading: false,
          items: snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })),
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        Sentry.captureException(error);
      });
  };

  _renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.props.onSelect(item)}>
      <Card>
        <Text>{item.name}</Text>
      </Card>
    </TouchableOpacity>
  );

  _keyExtractor = item => item.id;

  render() {
    return <View style={styles.searchContainer}>{this.renderChild()}</View>;
  }

  renderChild() {
    if (this.state.error) {
      return <Text>{this.state.error.message}</Text>;
    }

    if (this.props.query && !this.state.loading && !this.state.items.length) {
      return (
        <AlertCard
          onPress={() => {
            this.props.navigation.navigate('AddDistillery');
          }}
          heading="Can't find a distillery?"
          subheading={`Tap here to add ${this.props.query}.`}
        />
      );
    }

    if (this.state.loading && !this.state.items.length) {
      return <LoadingIndicator />;
    }

    return (
      <FlatList
        data={this.state.items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

class DistillerySelect extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    this.state = { query: '' };
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

  render() {
    let { navigation } = this.props;
    let { title } = navigation.state.params;
    return (
      <View style={styles.container}>
        <ModalHeader title={title} />
        <View style={styles.search}>
          <SearchBar
            lightTheme
            autoCorrect={false}
            onChangeText={text => this.setState({ query: text })}
            onClearText={text => this.setState({ query: text })}
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
          />
        </View>
        <SearchResults onSelect={this.onSelect} query={this.state.searchQuery} />
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

export default withNavigation(DistillerySelect);
