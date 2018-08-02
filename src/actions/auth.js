import { Alert } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Sentry } from 'react-native-sentry';

import {
  ACCESS_TOKEN_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from '../reducers/auth';

import firebase, { db } from '../firebase';

export const loginFacebook = () => {
  return dispatch => {
    dispatch(login());
    LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']).then(
      result => {
        if (result.isCancelled) {
          Alert.alert('Whoops!', 'You cancelled the sign in.');
        } else {
          dispatch(fetchAccessToken(true));
        }
      },
      error => {
        dispatch(loginFailure(error.message));
      }
    );
  };
};

export function fetchAccessToken(update = false) {
  return dispatch => {
    AccessToken.getCurrentAccessToken()
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(({ user }) => {
            if (updateUser) {
              dispatch(updateUser(user));
            }
            dispatch(loginSuccess(user));
          })
          .catch(error => {
            dispatch(loginFailure(error.message));
          });
      })
      .catch(error => {
        dispatch(accessTokenFailure(error.message));
      });
  };
}

export function login() {
  return {
    type: LOGIN,
  };
}

export function logOut() {
  firebase.auth().signOut();
  return {
    type: LOGOUT,
  };
}

export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user: user,
  };
}

export function loginFailure(error) {
  Sentry.captureException(error);
  Alert.alert('Sign in error', error);

  return {
    type: LOGIN_FAILURE,
    error,
  };
}

export function accessTokenFailure(error) {
  return {
    type: ACCESS_TOKEN_FAILURE,
    error,
  };
}

export function updateUser(user) {
  return dispatch => {
    db.collection('users')
      .doc(user.uid)
      .set({
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
      .then(() => {
        dispatch(updateUserSuccess(user));
      })
      .catch(error => {
        dispatch(updateUserFailure(user, error));
      });
  };
}
export function updateUserSuccess(user) {
  return {
    type: UPDATE_USER_SUCCESS,
    user,
  };
}

export function updateUserFailure(user, error) {
  Sentry.captureException(error);

  return {
    type: UPDATE_USER_FAILURE,
    user,
    error,
  };
}
