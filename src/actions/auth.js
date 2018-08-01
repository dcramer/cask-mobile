import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_OUT, LOG_OUT_SCCESS } from '../reducers/auth';

import { LoginManager } from 'react-native-fbsdk';

export function logIn() {
  return {
    type: LOG_IN,
  };
}

export function logOut() {
  LoginManager.logOut();
  return {
    type: LOG_OUT,
  };
}

export function logInSuccess(user) {
  return {
    type: LOG_IN_SUCCESS,
    user: user,
  };
}

export function logInFailure(err) {
  return {
    type: LOG_IN_FAILURE,
    error: err,
  };
}
