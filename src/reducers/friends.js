export const ADD_FRIEND_SUCCESS = 'ADD_FRIEND_SUCCESS';
export const ADD_FRIEND_FAILURE = 'ADD_FRIEND_FAILURE';
export const REMOVE_FRIEND_SUCCESS = 'ADD_FRIEND_SUCCESS';
export const REMOVE_FRIEND_FAILURE = 'ADD_FRIEND_FAILURE';

const initialState = {
  addFriendError: false,
  addFriendErrorMessage: '',
  removeFriendError: false,
  removeFriendErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_FRIEND_FAILURE:
      return {
        ...state,
        addFriendError: true,
        addFriendErrorMessage: action.error.message,
      };
    case REMOVE_FRIEND_FAILURE:
      return {
        ...state,
        removeFriendError: true,
        removeFriendErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
