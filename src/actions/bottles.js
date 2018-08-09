import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { ADD_BOTTLE_SUCCESS, ADD_BOTTLE_FAILURE } from '../reducers/bottles';
import api from '../api';

const GQL_LIST_BOTTLES = gql`
  query BottlesQuery($query: String) {
    bottles(query: $query) {
      id
      name
      distillery {
        name
      }
      brand {
        name
      }
    }
  }
`;

const GQL_ADD_BOTTLE = gql`
  mutation AddBottle($name: String!, $distillery: String!, $brand: String!) {
    addBottle(name: $name, distillery: $distillery, brand: $brand) {
      bottle {
        id
        name
        distillery {
          name
        }
        brand {
          name
        }
      }
    }
  }
`;

export function getBottles(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_BOTTLES,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.bottles);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addBottle(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_BOTTLE,
          variables: data,
        })
        .then(resp => {
          resolve(resp.data.bottle);
          return dispatch(addBottleSuccess(resp.data.bottle));
        })
        .catch(error => {
          reject(error);
          return dispatch(addBottleFailure(error));
        });
    });
  };
}

export function addBottleSuccess(bottle) {
  return {
    type: ADD_BOTTLE_SUCCESS,
    bottle,
  };
}

export function addBottleFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_BOTTLE_FAILURE,
    error,
  };
}
