import { Sentry } from 'react-native-sentry';

import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkIns';

import { db } from '../firebase';

export function checkIn(data) {
  return dispatch => {
    db.collection('checkins')
      .add(data)
      .then(docRef => {
        dispatch(checkInSuccess(docRef.id, data));
      })
      .catch(error => {
        dispatch(checkInFailure(data, error));
      });
  };
}
export function checkInSuccess(id, data) {
  return {
    type: CHECK_IN_SUCCESS,
    id,
    data,
  };
}

export function checkInFailure(data, error) {
  Sentry.captureException(error);

  return {
    type: CHECK_IN_FAILURE,
    data,
    error,
  };
}
