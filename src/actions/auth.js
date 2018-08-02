import { Alert } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import {
  ACCESS_TOKEN_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../reducers/auth';

import firebase from '../firebase';

export const loginFacebook = () => {
  return dispatch => {
    dispatch(login());
    LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']).then(
      result => {
        if (result.isCancelled) {
          Alert.alert('Whoops!', 'You cancelled the sign in.');
        } else {
          dispatch(fetchAccessToken());
        }
      },
      error => {
        dispatch(loginFailure(error.message));
      }
    );
  };
};

export function fetchAccessToken() {
  return dispatch => {
    AccessToken.getCurrentAccessToken()
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(() => {
            dispatch(loginSuccess(data));
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
  LoginManager.logOut();
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
