import { Sentry } from 'react-native-sentry';

import { ADD_BOTTLE_SUCCESS, ADD_BOTTLE_FAILURE } from '../reducers/bottles';

import { db } from '../firebase';

export function addBottle(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      db.collection('bottles')
        .add(data)
        .then(docRef => {
          let bottle = {
            id: docRef.id,
            ...data,
          };
          resolve(bottle);
          return dispatch(addBottleSuccess(bottle));
        })
        .catch(error => {
          reject(error);
          return dispatch(addBottleFailure(error));
        });
    });
  };
}
export function addBottleSuccess(bottle) {
  return {
    type: ADD_BOTTLE_SUCCESS,
    bottle,
  };
}

export function addBottleFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_BOTTLE_FAILURE,
    error,
  };
}
