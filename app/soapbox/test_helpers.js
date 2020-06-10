'use strict';

import React from 'react';
import thunk from 'redux-thunk';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';

// Mock Redux
// https://redux.js.org/recipes/writing-tests/
const middlewares = [thunk];
export const mockStore = configureMockStore(middlewares);

// Create test component with i18n and Redux store, etc
export const createComponent = (children, props = { locale: 'en', store: mockStore(ImmutableMap()) }) => {
  return renderer.create(
    <Provider store={props.store}>
      <IntlProvider locale={props.locale}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </IntlProvider>
    </Provider>
  );
};