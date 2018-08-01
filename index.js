import React from 'react';
import { AppRegistry } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Sentry } from 'react-native-sentry';

import App from './src/App';
import rootReducer from './src/reducers';

Sentry.config('https://0dea694b33ed4112ba33163458d72df2@sentry.io/1252089').install();

const store = createStore(rootReducer, applyMiddleware(thunk));

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent('peated', () => ReduxApp);
