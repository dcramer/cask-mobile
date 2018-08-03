import { db } from '../firebase';

export const getAll = docs => {
  return Promise.all(docs.map(doc => doc.get()));
};

export const populateRelations = (items, relations) => {
  /*
  * Populates relations on a set of items (effectively a hash join).
  *
  * Returns a Promise.
  *
  *   populateRelations(snapshot.docs, [
  *     {name: 'bottle', collection: 'bottles', relations: [...]}
  *   ])
  */
  let promises = relations.map(relation => {
    return new Promise((resolve, reject) => {
      let { name, collection } = relation;
      try {
        getAll(items.filter(d => !!d[name]).map(d => db.doc(`${collection}/${d[name]}`))).then(
          snapshot => {
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
          }
        );
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
