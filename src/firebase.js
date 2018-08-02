import firebase from 'firebase';
import 'firebase/firestore';

import { firebase as firebaseConfig, firestore as firestoreConfig } from '../config';

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

db.settings(firestoreConfig);

export default firebase;
