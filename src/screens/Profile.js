import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import { logOut } from '../actions/auth';
import { colors, margins } from '../styles';

class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  render() {
    return (
      <View style={styles.container}>
        <ButtonGroup
          containerStyle={styles.buttonGroup}
          textStyle={styles.buttonText}
          selectedIndex={0}
          innerBorderStyle={styles.buttonGroupInnerBorderStyle}
          selectedButtonStyle={styles.buttonActive}
          selectedTextStyle={styles.buttonActiveText}
          buttons={['Activity', 'Friends', 'Settings']}
        />
        <Button onPress={this.props.logOut} title="Log Out" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonGroup: {
    backgroundColor: '#fff',
    borderColor: colors.primary,
    marginTop: margins.half,
    marginBottom: margins.half,
    borderWidth: 2,
  },
  buttonGroupInnerBorderStyle: {
    color: colors.primary,
    width: 2,
  },
  buttonText: {
    color: colors.default,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonActiveText: {
    color: '#fff',
  },
});

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { logOut }
)(Profile);
