import { db } from '../firebase';

/*
* https://stackoverflow.com/questions/46573804/firestore-query-documents-startswith-a-string
*/
export const buildSuccessorKey = query => {
  let len = query.length;
  let startChunk = query.slice(0, len - 1);
  let endChar = query.slice(len - 1, len.length);

  return startChunk + String.fromCharCode(endChar.charCodeAt(0) + 1);
};

export const getAll = docIds => {
  return Promise.all(docIds.map(docId => db.doc(docId).get()));
};

export const getAllFromCollection = (collection, ids) => {
  return getAll(ids.map(id => `${collection}/${id}`));
};

/*
* Populates relations on a set of items (effectively a hash join).
*
* Returns a Promise.
*
*   populateRelations(snapshot.docs, [
*     {name: 'bottle', collection: 'bottles', relations: [...]}
*   ])
*/
export const populateRelations = (items, relations) => {
  let promises = relations.map(relation => {
    return new Promise((resolve, reject) => {
      let { name, collection } = relation;
      try {
        getAll(items.filter(d => !!d[name]).map(d => `${collection}/${d[name]}`)).then(snapshot => {
          let results = {};
          snapshot.forEach(doc => {
            results[doc.id] = {
              id: doc.id,
              ...doc.data(),
            };
          });
          if (relation.relations) {
            populateRelations(Object.values(results), relation.relations)
              .then(finalResults => {
                finalResults.forEach(fr => {
                  results[fr.id] = fr;
                });
                resolve({ name, results });
              })
              .catch(error => {
                reject(error);
              });
          } else {
            resolve({ name, results });
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  });

  return new Promise(resolve => {
    Promise.all(promises).then(values => {
      resolve(
        items.map(item => {
          let result = { ...item };
          values.forEach(({ name, results }) => {
            result[name] = results[item[name]];
          });
          return result;
        })
      );
    });
  });
};
