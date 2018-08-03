import { Sentry } from 'react-native-sentry';

import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkIns';

import { db } from '../firebase';

export function checkIn(data) {
  return dispatch => {
    db.collection('checkins')
      .add(data)
      .then(docRef => {
        dispatch(
          checkInSuccess({
            id: docRef.id,
            ...data,
          })
        );
      })
      .catch(error => {
        dispatch(checkInFailure(error));
      });
  };
}
export function checkInSuccess(checkIn) {
  return {
    type: CHECK_IN_SUCCESS,
    checkIn,
  };
}

export function checkInFailure(error) {
  Sentry.captureException(error);

  return {
    type: CHECK_IN_FAILURE,
    error,
  };
}
