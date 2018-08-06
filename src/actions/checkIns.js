import { Sentry } from 'react-native-sentry';

import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkIns';

import firebase, { db } from '../firebase';

export function checkIn(data) {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let batch = db.batch();
      let checkInRef = db
        .collection('checkins')
        .doc()
        .set(checkInRef, {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          ...data,
        })
        .then(() => {
          let item = {
            id: checkInRef.id,
            ...data,
          };
          resolve(item);
          dispatch(checkInSuccess(item));
        })
        .catch(error => {
          reject(error);
          dispatch(checkInFailure(error));
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
