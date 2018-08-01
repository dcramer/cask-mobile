import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, margins } from '../styles';

export default ({ children, style }) => <View style={[styles.container, style]}>{children}</View>;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: margins.half,
    paddingLeft: margins.full,
    paddingRight: margins.full,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.trim,
  },
});
