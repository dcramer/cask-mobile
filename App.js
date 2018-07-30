import React, { Component } from 'react';
import Sentry from 'sentry-expo';

import { createRootNavigator } from './js/router';

Sentry.enableInExpoDevelopment = true;
Sentry.config('https://0dea694b33ed4112ba33163458d72df2@sentry.io/1252089').install();

const RootStack = createRootNavigator();

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}
