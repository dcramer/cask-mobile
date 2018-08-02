import { combineReducers } from 'redux';
import auth from './auth';
import checkIns from './checkIns';

export default combineReducers({
  auth,
  checkIns,
});
