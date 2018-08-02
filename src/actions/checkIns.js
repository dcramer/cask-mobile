import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkIns';
import { Sentry } from 'react-native-sentry';

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
export function checkInSuccess(user) {
  return {
    type: CHECK_IN_SUCCESS,
    user,
  };
}

export function checkInFailure(user, error) {
  Sentry.captureException(error);

  return {
    type: CHECK_IN_FAILURE,
    user,
    error,
  };
}
