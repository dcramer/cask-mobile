/* global __dirname */
import fs from 'fs';
import path from 'path';
import * as firestore from 'expect-firestore';

import firebase from 'firebase';

const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

const RULES = fs.readFileSync(path.join(__dirname, '../firestore.rules'), { encoding: 'utf8' });

const CREDENTIAL = JSON.parse(fs.readFileSync(path.join(__dirname, '../credentials.json')));

// NOTE(dcramer): There's a bug in expect-firestore that requires all data to have a
// subcollection defined even if its empty
// NOTE(dcramer): We're currently broken because the firestore simulator does not define request.time (sigh)
const db = new firestore.Database({
  // Credentials from firebase console
  credential: CREDENTIAL,
  rules: RULES,
  data: {
    users: [
      {
        key: 'userA',
        fields: {
          name: 'John Doe',
          photoURL: '',
          createdAt: serverTimestamp(),
        },
        collections: {
          feed: [
            {
              key: 'checkInA',
              fields: {
                createdAt: serverTimestamp(),
              },
              collections: {},
            },
          ],
          friends: [
            {
              key: 'userB',
              fields: {
                following: true,
                follower: false,
                createdAt: serverTimestamp(),
              },
              collections: {},
            },
          ],
        },
      },
      {
        key: 'userB',
        fields: {
          name: 'Jane Doe',
          photoURL: '',
          createdAt: serverTimestamp(),
        },
        collections: {},
      },
    ],
    distilleries: [
      {
        key: 'distA',
        fields: {
          name: 'Macallan',
          country: 'Scotland',
          region: 'Speyside',
          createdAt: serverTimestamp(),
        },
        collections: {},
      },
    ],
    bottles: [
      {
        key: 'bottleA',
        fields: {
          name: 'Macallan 15',
          distillery: 'distA',
          stagedAge: 15,
          createdAt: serverTimestamp(),
        },
        collections: {},
      },
    ],
    checkins: [
      {
        key: 'checkinA',
        fields: {
          bottle: 'bottleA',
          userAdded: 'userA',
          rating: 0,
          notes: '',
          location: null,
          flavorProfile: [],
          createdAt: serverTimestamp(),
        },
        collections: {},
      },
      {
        key: 'checkinB',
        fields: {
          bottle: 'bottleA',
          userAdded: 'userB',
          rating: 0,
          notes: '',
          location: null,
          flavorProfile: [],
          createdAt: serverTimestamp(),
        },
        collections: {},
      },
    ],
  },
});

describe('/users/{userId}', () => {
  beforeAll(async () => {
    await db.authorize();
  });

  describe('read', () => {
    it('should allow self', async () => {
      const result = await db.canGet({ uid: 'userA' }, 'users/userA');
      firestore.assert(result);
    });

    it('should allow other user', async () => {
      const result = await db.canGet({ uid: 'userA' }, 'users/userB');
      firestore.assert(result);
    });

    it('should not allow anonymous', async () => {
      const result = await db.cannotGet({}, 'users/userB');
      firestore.assert(result);
    });
  });

  describe('set', () => {
    it('should allow self', async () => {
      const result = await db.canSet({ uid: 'userC' }, 'users/userC', {
        displayName: 'Jim',
        email: 'jim@example.com',
        photoURL: '',
        createdAt: serverTimestamp(),
      });
      firestore.assert(result);
    });

    it('should not allow other user', async () => {
      const result = await db.cannotSet({ uid: 'userA' }, 'users/userC', {
        displayName: 'Jim',
        email: 'jim@example.com',
        photoURL: '',
        createdAt: serverTimestamp(),
      });
      firestore.assert(result);
    });

    it('should not allow anonymous', async () => {
      const result = await db.cannotSet({}, 'users/userC', {
        displayName: 'Jim',
        email: 'jim@example.com',
        photoURL: '',
        createdAt: serverTimestamp(),
      });
      firestore.assert(result);
    });
  });

  describe('/feed', () => {
    describe('read', () => {
      it('should allow self', async () => {
        const result = await db.canGet({ uid: 'userA' }, 'users/userA/feed/checkInA');
        firestore.assert(result);
      });

      it('should not allow other user', async () => {
        const result = await db.cannotGet({ uid: 'userB' }, 'users/userA/feed/checkInA');
        firestore.assert(result);
      });

      it('should not allow anonymous', async () => {
        const result = await db.cannotGet({}, 'users/userA/feed/checkInA');
        firestore.assert(result);
      });
    });

    describe('set', () => {
      it('should allow adding items to self if self', async () => {
        const result = await db.canSet({ uid: 'userA' }, 'users/userA/feed/checkInA', {
          createdAt: serverTimestamp(),
        });
        firestore.assert(result);
      });

      it('should allow adding items to self if following user', async () => {
        const result = await db.canSet({ uid: 'userA' }, 'users/userA/feed/checkInB', {
          createdAt: serverTimestamp(),
        });
        firestore.assert(result);
      });
    });
  });

  describe('/friends', () => {
    describe('read', () => {
      it('should allow self', async () => {
        const result = await db.canGet({ uid: 'userA' }, 'users/userA/friends/userB');
        firestore.assert(result);
      });

      it('should allow associated user', async () => {
        const result = await db.canGet({ uid: 'userB' }, 'users/userA/friends/userB');
        firestore.assert(result);
      });

      it('should not allow stranger', async () => {
        const result = await db.cannotGet({ uid: 'userC' }, 'users/userA/friends/userB');
        firestore.assert(result);
      });

      it('should not allow anonymous', async () => {
        const result = await db.cannotGet({}, 'users/userA/friends/userB');
        firestore.assert(result);
      });
    });

    describe('set', () => {
      it('should allow self to set following user', async () => {
        const result = await db.canSet({ uid: 'userA' }, 'users/userA/friends/userB', {
          createdAt: serverTimestamp(),
          following: true,
          follower: false,
        });
        firestore.assert(result);
      });

      it('should not allow self set follower user', async () => {
        const result = await db.cannotSet({ uid: 'userA' }, 'users/userA/friends/userB', {
          createdAt: serverTimestamp(),
          following: true,
          follower: true,
        });
        firestore.assert(result);
      });

      it('should allow user to set follower self', async () => {
        const result = await db.canSet({ uid: 'userB' }, 'users/userA/friends/userB', {
          createdAt: serverTimestamp(),
          following: false,
          follower: true,
        });
        firestore.assert(result);
      });

      it('should not allow user to set following self', async () => {
        const result = await db.cannotSet({ uid: 'userB' }, 'users/userA/friends/userB', {
          createdAt: serverTimestamp(),
          following: true,
          follower: true,
        });
        firestore.assert(result);
      });
    });
  });
});

describe('/distilleries/{distilleryId}', () => {
  beforeAll(async () => {
    await db.authorize();
  });

  describe('read', () => {
    it('should allow authenticated', async () => {
      const result = await db.canGet({ uid: 'userA' }, 'distilleries/distA');
      firestore.assert(result);
    });

    it('should not allow anonymous', async () => {
      const result = await db.cannotGet({}, 'distilleries/distA');
      firestore.assert(result);
    });
  });

  describe('set', () => {
    it('should allow authenticated', async () => {
      const result = await db.canSet({ uid: 'userA' }, 'distilleries/distB', {
        userAdded: 'userA',
        createdAt: serverTimestamp(),
        name: 'Highland Park',
        country: 'Scotland',
        region: 'Highlands',
      });
      firestore.assert(result);
    });

    it('requires current user as userAdded', async () => {
      const result = await db.cannotSet({ uid: 'userA' }, 'distilleries/distB', {
        userAdded: 'userB',
        createdAt: serverTimestamp(),
        name: 'Highland Park',
        country: 'Scotland',
        region: 'Highlands',
      });
      firestore.assert(result);
    });
  });
});

describe('/bottles/{bottleId}', () => {
  beforeAll(async () => {
    await db.authorize();
  });

  describe('read', () => {
    it('should allow authenticated', async () => {
      const result = await db.canGet({ uid: 'userA' }, 'bottles/bottleA');
      firestore.assert(result);
    });

    it('should not allow anonymous', async () => {
      const result = await db.cannotGet({}, 'bottles/bottleA');
      firestore.assert(result);
    });
  });

  describe('set', () => {
    it('should allow authenticated', async () => {
      const result = await db.canSet({ uid: 'userA' }, 'bottles/bottleB', {
        name: 'Test',
        userAdded: 'userA',
        createdAt: serverTimestamp(),
        distillery: 'distA',
      });
      firestore.assert(result);
    });

    it('requires current user as userAdded', async () => {
      const result = await db.cannotSet({ uid: 'userA' }, 'bottles/bottleB', {
        name: 'Test',
        userAdded: 'userB',
        createdAt: serverTimestamp(),
        distillery: 'distA',
      });
      firestore.assert(result);
    });

    it('requires valid bottle', async () => {
      const result = await db.cannotSet({ uid: 'userA' }, 'bottles/bottleB', {
        name: 'Test',
        userAdded: 'userA',
        createdAt: serverTimestamp(),
        distillery: 'distZ',
      });
      firestore.assert(result);
    });
  });
});

describe('/checkins/{checkIn}', () => {
  beforeAll(async () => {
    await db.authorize();
  });

  describe('read', () => {
    it('should allow authenticated', async () => {
      const result = await db.canGet({ uid: 'userA' }, 'checkins/checkinA');
      firestore.assert(result);
    });

    it('should allow other user', async () => {
      const result = await db.canGet({ uid: 'userB' }, 'checkins/checkinA');
      firestore.assert(result);
    });

    it('should not allow anonymous', async () => {
      const result = await db.cannotGet({}, 'checkins/checkinA');
      firestore.assert(result);
    });
  });

  describe('set', () => {
    it('should allow authenticated', async () => {
      const result = await db.canSet({ uid: 'userA' }, 'checkins/checkInZ', {
        createdAt: serverTimestamp(),
        userAdded: 'userA',
        bottle: 'bottleA',
        notes: '',
        rating: 0,
        location: null,
        friends: [],
        flavorProfile: [],
      });
      firestore.assert(result);
    });

    it('requires current user as user', async () => {
      const result = await db.cannotSet({ uid: 'userB' }, 'checkins/checkInZ', {
        createdAt: serverTimestamp(),
        userAdded: 'userA',
        bottle: 'bottleA',
        notes: '',
        rating: 0,
        location: null,
        friends: [],
        flavorProfile: [],
      });
      firestore.assert(result);
    });

    it('requires valid bottle', async () => {
      const result = await db.cannotSet({ uid: 'userA' }, 'checkins/checkInZ', {
        createdAt: serverTimestamp(),
        userAdded: 'userA',
        bottle: 'bottleB',
        notes: '',
        rating: 0,
        location: null,
        friends: [],
        flavorProfile: [],
      });
      firestore.assert(result);
    });
  });
});
