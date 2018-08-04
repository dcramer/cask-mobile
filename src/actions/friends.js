import { Sentry } from 'react-native-sentry';

import {
  ADD_FRIEND_SUCCESS,
  ADD_FRIEND_FAILURE,
  REMOVE_FRIEND_SUCCESS,
  REMOVE_FRIEND_FAILURE,
} from '../reducers/friends';

import firebase, { db } from '../firebase';

export function addFriend(fromUserId, toUserId) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      db.collection('users')
        .doc(fromUserId)
        .collection('friends')
        .doc(toUserId)
        .set({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(doc => {
          resolve(fromUserId, toUserId);
          return dispatch(addFriendSuccess(fromUserId, toUserId));
        })
        .catch(error => {
          reject(error);
          return dispatch(addFriendFailure(error));
        });
    });
  };
}

export function removeFriend(fromUserId, toUserId) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      db.collection('users')
        .doc(fromUserId)
        .collection('friends')
        .doc(toUserId)
        .delete()
        .then(doc => {
          resolve(fromUserId, toUserId);
          return dispatch(removeFriendSuccess(fromUserId, toUserId));
        })
        .catch(error => {
          reject(error);
          return dispatch(removeFriendFailure(error));
        });
    });
  };
}

export function addFriendSuccess(fromUserId, toUserId) {
  return {
    type: ADD_FRIEND_SUCCESS,
    fromUserId,
    toUserId,
  };
}

export function addFriendFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_FRIEND_FAILURE,
    error,
  };
}

export function removeFriendSuccess(fromUserId, toUserId) {
  return {
    type: REMOVE_FRIEND_SUCCESS,
    fromUserId,
    toUserId,
  };
}

export function removeFriendFailure(error) {
  Sentry.captureException(error);

  return {
    type: REMOVE_FRIEND_FAILURE,
    error,
  };
}
