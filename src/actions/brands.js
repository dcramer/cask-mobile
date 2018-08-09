import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { ADD_BRAND_SUCCESS, ADD_BRAND_FAILURE } from '../reducers/brands';
import api from '../api';

const GQL_LIST_BRANDS = gql`
  query BrandsQuery($query: String) {
    brands(query: $query) {
      id
      name
    }
  }
`;

const GQL_ADD_BRAND = gql`
  mutation AddBrand($name: String!) {
    addBrand(name: $name) {
      ok
      errors
      brand {
        id
        name
      }
    }
  }
`;

export function getBrands(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_BRANDS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.brands);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addBrand(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_BRAND,
          variables: data,
        })
        .then(resp => {
          resolve(resp.data.brand);
          return dispatch(addBrandSuccess(resp.data.brand));
        })
        .catch(error => {
          reject(error);
          return dispatch(addBrandFailure(error));
        });
    });
  };
}

export function addBrandSuccess(brand) {
  return {
    type: ADD_BRAND_SUCCESS,
    brand,
  };
}

export function addBrandFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_BRAND_FAILURE,
    error,
  };
}
