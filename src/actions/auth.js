import { Alert, AsyncStorage } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import api from '../api';

import {
  ACCESS_TOKEN_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../reducers/auth';

const GQL_LOGIN = gql`
  mutation LoginMutation($facebookToken: String!) {
    login(facebookToken: $facebookToken) {
      user {
        id
        email
        name
      }
    }
  }
`;

const GQL_GET_VIEWER = gql`
  query ViewerQuery {
    me {
      id
      email
      name
    }
  }
`;

export const fetchSession = async () => {
  try {
    let session = await AsyncStorage.getItem('@cask:auth');
    return await JSON.parse(session);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const storeSession = async session => {
  try {
    await AsyncStorage.setItem(`@cask:auth`, JSON.stringify(session));
  } catch (e) {}
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(`@cask:auth`);
  } catch (e) {}
};

export const loginFacebook = () => {
  return dispatch => {
    dispatch(login());
    LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']).then(
      result => {
        if (!result.isCancelled) {
          dispatch(refreshSession());
        }
      },
      error => {
        dispatch(loginFailure(error.message));
      }
    );
  };
};

export function refreshSession() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      AccessToken.getCurrentAccessToken()
        .then(data => {
          api
            .mutate({
              mutation: GQL_LOGIN,
              variables: { facebookToken: data.accessToken },
            })
            .then(resp => {
              const session = {
                token: resp.data.login.token,
              };
              dispatch(loginSuccess(resp.data.login.user, session));
              resolve();
            })
            .catch(error => {
              dispatch(loginFailure(error.message));
              reject(error);
            });
        })
        .catch(error => {
          dispatch(accessTokenFailure(error.message));
          reject(error);
        });
    });
  };
}

export function getUserInfo() {
  return dispatch => {
    api
      .query({
        query: GQL_GET_VIEWER,
      })
      .then(resp => {
        dispatch(loginSuccess(resp.data.viewer));
      })
      .catch(error => {
        dispatch(loginFailure(error.message));
      });
  };
}

export function login() {
  return {
    type: LOGIN,
  };
}

export function logOut() {
  return dispatch => {
    clearSession();
    api.resetStore();
    dispatch({
      type: LOGOUT,
    });
  };
}

export function loginSuccess(user, session) {
  return async dispatch => {
    await storeSession(session);

    return dispatch({
      type: LOGIN_SUCCESS,
      user,
    });
  };
}

export function loginFailure(error) {
  return async dispatch => {
    Sentry.captureException(error);
    Alert.alert('Sign in error', error);

    await AsyncStorage.removeItem('@cask:auth');

    return dispatch({
      type: LOGIN_FAILURE,
      error,
    });
  };
}

export function accessTokenFailure(error) {
  return async dispatch => {
    await AsyncStorage.removeItem('@cask:auth');
    return dispatch({
      type: ACCESS_TOKEN_FAILURE,
      error,
    });
  };
}
