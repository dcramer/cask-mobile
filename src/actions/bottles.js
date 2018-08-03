import { Sentry } from 'react-native-sentry';

import { ADD_BOTTLE_SUCCESS, ADD_BOTTLE_FAILURE } from '../reducers/bottles';

import { db } from '../firebase';

export function addBottle(data) {
  return dispatch => {
    db.collection('bottles')
      .add(data)
      .then(docRef => {
        dispatch(
          addBottleSuccess({
            id: docRef.id,
            ...data,
          })
        );
      })
      .catch(error => {
        dispatch(addBottleFailure(error, error));
      });
  };
}
export function addBottleSuccess(bottle) {
  return {
    type: ADD_BOTTLE_SUCCESS,
    bottle: bottle,
  };
}

export function addBottleFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_BOTTLE_FAILURE,
    error,
  };
}
