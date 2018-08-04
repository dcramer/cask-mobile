import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ViewPropTypes } from 'react-native';
import { SearchBar as RNESearchBar } from 'react-native-elements';

import { colors } from '../styles';

export default class SearchBar extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: ViewPropTypes.style,
    loading: PropTypes.bool,
  };

  render() {
    return (
      <RNESearchBar
        lightTheme
        autoCorrect={false}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        onChangeText={this.props.onChangeValue}
        onClearText={this.props.onChangeValue}
        containerStyle={styles.container}
        showLoadingIcon={this.props.loading}
        inputStyle={styles.input}
        placeholder="Search"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderTopWidth: 0,
  },
  input: {
    color: colors.dark,
    fontSize: 14,
    backgroundColor: '#eee',
  },
});
