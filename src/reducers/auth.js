export const LOG_IN = 'LOG_IN';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';

const initialState = {
  isAuthenticating: false,
  user: null,

  logInError: false,
  logInErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        isAuthenticating: true,
        logInError: false,
      };
    case LOG_IN_SUCCESS:
      return {
        isAuthenticating: false,
        user: action.user,
      };
    case LOG_IN_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        logInError: true,
        logInErrorMessage: action.error.message,
      };
    case LOG_OUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
