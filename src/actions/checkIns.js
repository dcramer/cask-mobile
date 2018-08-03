import { Sentry } from 'react-native-sentry';

import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkIns';

import firebase, { db } from '../firebase';

export function checkIn(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      db.collection('checkins')
        .add({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          ...data,
        })
        .then(doc => {
          let item = {
            id: doc.id,
            ...data,
          };
          resolve(item);
          return dispatch(checkInSuccess(item));
        })
        .catch(error => {
          reject(error);
          return dispatch(checkInFailure(error));
        });
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
