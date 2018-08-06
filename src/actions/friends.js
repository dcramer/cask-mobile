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

      let fromDoc = await fromRef.get();
      let toDoc = await toRef.get();

      let batch = db.batch();
      if (fromDoc.exists) {
        batch.update(fromRef, {
          following: true,
        });
      } else {
        batch.set(fromRef, {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          following: true,
          follower: false,
        });
      }

      if (toDoc.exists) {
        batch.update(toRef, {
          follower: true,
        });
      } else {
        batch.set(toRef, {
          follower: true,
          following: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }

      batch
        .commit()
        .then(() => {
          resolve(fromUserId, toUserId);
          dispatch(addFriendSuccess(fromUserId, toUserId));
        })
        .catch(error => {
          console.error(error);
          reject(error);
          dispatch(addFriendFailure(error));
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
      let fromDoc = await fromRef.get();
      let toDoc = await toRef.get();
      let batch = db.batch();
      if (fromDoc.exists) {
        batch.update(fromRef, {
          following: false,
        });
      }
      if (toDoc.exists) {
        batch.update(toRef, {
          follower: false,
        });
      }
      batch
        .commit()
        .then(() => {
          resolve(fromUserId, toUserId);
          dispatch(removeFriendSuccess(fromUserId, toUserId));
        })
        .catch(error => {
          reject(error);
          dispatch(removeFriendFailure(error));
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
