import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import rootReducer from '../reducers/rootReducer'
import {createLogger} from 'redux-logger';


let Middleware = [];
if (process.env.NODE_ENV === 'production') {
    Middleware = [thunkMiddleware, routerMiddleware(createHistory())]
} else {
    Middleware = [thunkMiddleware, routerMiddleware(createHistory()), createLogger()]
}


const createStoreWithMiddleware =
    compose(
        applyMiddleware(
            ...Middleware
        ),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState);
}

