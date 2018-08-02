import * as firebase from 'firebase';

import { firebase as firebaseConfig } from '../config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const database = firebaseApp.database().ref();
export default firebase;
