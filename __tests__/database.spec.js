/* global __dirname */
import fs from 'fs';
import path from 'path';
import * as firestore from 'expect-firestore';

const RULES = fs.readFileSync(path.join(__dirname, '../firestore.rules'), { encoding: 'utf8' });

const CREDENTIAL = JSON.parse(fs.readFileSync(path.join(__dirname, '../credentials.json')));

// const db = new Database({
//   data: DATA,
//   rules: RULES,
//   credential: CREDENTIAL
// });

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
          email: 'john@example.com',
          photoURL: '',
        },
        collections: {},
      },
      {
        key: 'userB',
        fields: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          photoURL: '',
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
        },
        collections: {},
      },
    ],
  },
});

describe('users', () => {
  beforeAll(async () => {
    await db.authorize();
  });

  describe('read', () => {
    it('should allow self', async () => {
      const result = await db.canGet({ uid: 'userA' }, 'users/userA');
      firestore.assert(result);
    });

    it('should not allow other user', async () => {
      const result = await db.cannotGet({ uid: 'userA' }, 'users/userB');
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
      });
      firestore.assert(result);
    });

    it('should not allow other user', async () => {
      const result = await db.cannotSet({ uid: 'userA' }, 'users/userC', {
        displayName: 'Jim',
        email: 'jim@example.com',
        photoURL: '',
      });
      firestore.assert(result);
    });

    it('should not allow anonymous', async () => {
      const result = await db.cannotSet({}, 'users/userC', {
        displayName: 'Jim',
        email: 'jim@example.com',
        photoURL: '',
      });
      firestore.assert(result);
    });
  });
});

describe('distilleries', () => {
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
        name: 'Highland Park',
        country: 'Scotland',
        region: 'Highlands',
      });
      firestore.assert(result);
    });

    it('requires current user as userAdded', async () => {
      const result = await db.cannotSet({ uid: 'userA' }, 'distilleries/distB', {
        userAdded: 'userB',
        name: 'Highland Park',
        country: 'Scotland',
        region: 'Highlands',
      });
      firestore.assert(result);
    });
  });
});
