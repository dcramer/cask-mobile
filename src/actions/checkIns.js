import { Sentry } from 'react-native-sentry';

import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkIns';

import firebase, { db } from '../firebase';

export function checkIn(data) {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let checkInRef = db.collection('checkins').doc();
      db.runTransaction(async transaction => {
        let checkInDoc = await transaction.get(checkInRef);
        if (checkInDoc.exists) {
          throw new Error('CheckIn already exists.');
        }
        await transaction.set(checkInRef, {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          ...data,
        });
        await (data.friends || []).forEach(async friendId => {
          let friendRef = checkInRef.collection('friends').doc(friendId);
          await transaction.set(friendRef, {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
        let item = {
          id: checkInDoc.id,
          ...data,
        };
        resolve(item);
        return dispatch(checkInSuccess(item));
      }).catch(error => {
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
