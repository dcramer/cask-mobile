import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkIns';

import api from '../api';
import firebase, { db } from '../firebase';

const GQL_LIST_CHECKINS = gql`
  query CheckInsQuery($createdBy: ID, $scope: String) {
    checkins(createdBy: $createdBy, scope: $scope) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export function getCheckIns(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_CHECKINS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.checkins.edges);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function checkIn(data) {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
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
