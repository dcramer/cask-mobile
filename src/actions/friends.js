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
    return new Promise(async (resolve, reject) => {
      let fromRef = db
        .collection('users')
        .doc(fromUserId)
        .collection('friends')
        .doc(toUserId);
      let toRef = db
        .collection('users')
        .doc(toUserId)
        .collection('friends')
        .doc(fromUserId);
      db.runTransaction(async transaction => {
        let fromDoc = await transaction.get(fromRef);
        let toDoc = await transaction.get(toRef);
        if (fromDoc.exists) {
          await transaction.update(fromRef, {
            following: true,
          });
        } else {
          await transaction.set(fromRef, {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            following: true,
          });
        }

        if (toDoc.exists) {
          await transaction.update(toRef, {
            follower: true,
          });
        } else {
          await transaction.set(toRef, {
            follower: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }

        resolve(fromUserId, toUserId);
        return dispatch(addFriendSuccess(fromUserId, toUserId));
      }).catch(error => {
        reject(error);
        return dispatch(addFriendFailure(error));
      });
    });
  };
}

export function removeFriend(fromUserId, toUserId) {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      let fromRef = db
        .collection('users')
        .doc(fromUserId)
        .collection('friends')
        .doc(toUserId);
      let toRef = db
        .collection('users')
        .doc(toUserId)
        .collection('friends')
        .doc(fromUserId);
      db.runTransaction(async transaction => {
        let fromDoc = await transaction.get(fromRef);
        let toDoc = await transaction.get(toRef);
        if (fromDoc.exists) {
          await transaction.update(fromRef, {
            following: false,
          });
        }
        if (toDoc.exists) {
          await transaction.update(toRef, {
            follower: false,
          });
        }
        resolve(fromUserId, toUserId);
        return dispatch(removeFriendSuccess(fromUserId, toUserId));
      }).catch(error => {
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
