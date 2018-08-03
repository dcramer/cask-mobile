import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, StyleSheet, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import { logOut } from '../actions/auth';
import { colors, margins } from '../styles';
import { db } from '../firebase';
import Activity from '../components/Activity';
import ModalHeader from '../components/ModalHeader';

class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    selectedButton: 0,
  };

  renderButtonContent() {
    let { selectedButton } = this.state;
    if (selectedButton === 0)
      return (
        <Activity
          auth={this.props.auth}
          navigation={this.props.navigation}
          queryset={db
            .collection('checkins')
            .where('user', '==', this.props.auth.user.uid)
            .orderBy('createdAt', 'desc')}
        />
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <ModalHeader
          title="Profile"
          leftActionOnPress={null}
          rightActionOnPress={() =>
            Alert.alert('Confirm', 'Do you want to log out of this application?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Continue', onPress: this.props.logOut },
            ])
          }
          rightActionText="Log Out"
        />
        <ButtonGroup
          containerStyle={styles.buttonGroup}
          textStyle={styles.buttonText}
          selectedIndex={this.state.selectedButton}
          innerBorderStyle={styles.buttonGroupInnerBorderStyle}
          selectedButtonStyle={styles.buttonActive}
          selectedTextStyle={styles.buttonActiveText}
          onPress={idx => this.setState({ selectedButton: idx })}
          buttons={['Activity', 'Friends', 'Settings']}
        />
        {this.renderButtonContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
