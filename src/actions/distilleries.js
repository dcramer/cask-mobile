import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { ADD_DISTILLERY_SUCCESS, ADD_DISTILLERY_FAILURE } from '../reducers/distilleries';
import api from '../api';

const GQL_LIST_DISTILLERIES = gql`
  query DistilleriesQuery($query: String) {
    distilleries(query: $query) {
      id
      name
      region {
        id
        name
        country {
          id
          name
        }
      }
    }
  }
`;

const GQL_ADD_DISTILLERY = gql`
  mutation AddDistillery($name: String!, $region: UUID!) {
    addDistillery(name: $name, region: $region) {
      ok
      errors
      distillery {
        id
        name
        region {
          id
          name
          country {
            id
            name
          }
        }
      }
    }
  }
`;

export function getDistilleries(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_DISTILLERIES,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.distilleries);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addDistillery(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_DISTILLERY,
          variables: data,
        })
        .then(resp => {
          resolve(resp.data.distillery);
          return dispatch(addDistillerySuccess(resp.data.distillery));
        })
        .catch(error => {
          reject(error);
          return dispatch(addDistilleryFailure(error));
        });
    });
  };
}

export function addDistillerySuccess(distillery) {
  return {
    type: ADD_DISTILLERY_SUCCESS,
    distillery,
  };
}

export function addDistilleryFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_DISTILLERY_FAILURE,
    error,
  };
}
