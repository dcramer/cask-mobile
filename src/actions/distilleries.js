import { Sentry } from 'react-native-sentry';

import { ADD_DISTILLERY_SUCCESS, ADD_DISTILLERY_FAILURE } from '../reducers/distilleries';

import { db } from '../firebase';

export function addDistillery(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      db.collection('distilleries')
        .add(data)
        .then(docRef => {
          let item = {
            id: docRef.id,
            ...data,
          };
          resolve(item);
          return dispatch(addDistillerySuccess(item));
        })
        .catch(error => {
          reject(error);
          return dispatch(addDistilleryFailure(error));
        });
    });
  };
}
export function addDistillerySuccess(distillery) {
  return {
    type: ADD_DISTILLERY_SUCCESS,
    distillery,
  };
}

export function addDistilleryFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_DISTILLERY_FAILURE,
    error,
  };
}
