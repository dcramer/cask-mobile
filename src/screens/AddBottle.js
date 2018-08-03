import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { addBottle } from '../actions/bottles';
import { colors, margins } from '../styles';
import DistilleryField from '../components/forms/DistilleryField';
import TagField from '../components/forms/TagField';
import TextField from '../components/forms/TextField';

class AddBottle extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    title: 'Add Bottle',
  };

  constructor(...args) {
    super(...args);
    this.state = {
      name: '',
      distillery: null,
      category: '',
      abv: null,
      statedAge: null,
      vintageYear: null,
      bottleYear: null,
      caskType: '',
      series: '',
      error: null,
      submitting: false,
    };
  }

  onChangeValue = (name, value) => {
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    if (!this.isValid()) return;
    if (this.state.submitting) return;
    let state = this.state;
    let { auth, navigation } = this.props;
    this.setState({ error: null, submitting: true });
    this.props
      .addBottle({
        userAdded: auth.user.uid,
        name: state.name,
        distillery: state.distillery ? state.distillery.id : null,
        category: state.category.length ? state.category[0] : null,
        series: state.series,
        statedAge: state.statedAge,
        vintageYear: state.vintageYear,
        bottleYear: state.bottleYear,
        caskType: state.caskType,
        abv: state.abv,
      })
      .then(bottle => {
        navigation.navigate('BottleDetails', {
          id: bottle.id,
          bottle: {
            ...bottle,
            distillery: state.distillery,
          },
        });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  isValid = () => {
    let state = this.state;

    if (!state.name) return false;

    if (!state.distillery) return false;

    //if (!state.category) return false;

    if (state.statedAge && !(parseInt(state.statedAge, 10) > 0)) return false;

    return true;
  };

  render() {
    return (
      <ScrollView>
        {!!this.state.error && <Text>Error: {this.state.error.message}</Text>}
        <TextField
          onChangeValue={v => this.onChangeValue('name', v)}
          name="Name"
          placeholder="e.g. Bowmore 1965"
        />
        <DistilleryField
          onChangeValue={v => this.onChangeValue('distillery', v)}
          name="Distillery"
        />
        <TextField
          onChangeValue={v => this.onChangeValue('statedAge', v)}
          name="Stated Age (in years)"
          placeholder="e.g. 21"
          keyboardType="number-pad"
        />
        <TagField
          onChangeValue={v => this.onChangeValue('category', v)}
          name="Category"
          maxValues={1}
          tagList={['Single Malt', 'Scotch', 'Rye', 'Bourbon']}
        />
        <TextField
          onChangeValue={v => this.onChangeValue('series', v)}
          name="Series"
          placeholder="e.g. 2018 Limited"
        />
        <Button
          title="Add Bottle"
          onPress={this.onSubmit}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={[styles.button, this.isValid() && styles.buttonPrimary]}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: margins.full,
    marginBottom: margins.full,
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
});

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { addBottle }
)(AddBottle);
