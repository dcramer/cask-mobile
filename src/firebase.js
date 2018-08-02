import firebase from 'firebase';
require('firebase/firestore');

import { firebase as firebaseConfig } from '../config';

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true,
});

export default firebase;
