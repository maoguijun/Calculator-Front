import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux';
import configureStore from './store/configure-store';
import {ConnectedRouter} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

const store = configureStore();
const history = createHistory();
// console.log('store:',store);/
const state = store.getState();
console.log(state);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);


registerServiceWorker();
