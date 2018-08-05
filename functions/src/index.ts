import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);

// TODO(dcramer): we could use these to enforce data, but it's preffered to
// let the app do this since functions have a delay
// export const onUserCreate = functions.database.ref('/users/{userId}').onCreate(event => {
//   return event.ref.update({ createdAt: Date.now() });
// });

export const writeFeedCheckIn = functions.firestore
  .document('checkins/{checkIn}')
  .onWrite(async (change, context) => {
    const changeData = change.after.data();

    // Who posted it?
    const userId = changeData.userAdded;

    const checkInId = context.params.checkIn;
    const checkInDate = changeData.createdAt;

    // Find their friends
    const friendsSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('friends')
      .where('follower', '==', true)
      .get();

    friendsSnapshot.forEach(async friendDoc => {
      await admin
        .firestore()
        .collection('users')
        .doc(friendDoc.id)
        .collection('feed')
        .doc(checkInId)
        .set({
          createdAt: checkInDate,
        });
    });
  });

export const deleteFeedCheckIn = functions.firestore
  .document('checkins/{checkIn}')
  .onDelete(async (change, context) => {
    const changeData = change.data();

    // Who posted it?
    const userId = changeData.userAdded;

    const checkInId = context.params.checkIn;

    // Find their friends
    const friendsSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('friends')
      .where('follower', '==', true)
      .get();

    friendsSnapshot.forEach(async friendDoc => {
      await admin
        .firestore()
        .collection('users')
        .doc(friendDoc.id)
        .collection('feed')
        .doc(checkInId)
        .delete();
    });
  });

export default {};
