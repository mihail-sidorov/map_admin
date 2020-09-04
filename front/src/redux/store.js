import {createStore, combineReducers} from 'redux';
import pointsPageReducer from './pointsPageReducer';
import authReducer from './authReducer';
import {reducer as formReducer} from 'redux-form';
import adminPageReducer from './adminPageReducer';

let reducers = combineReducers({
    pointsPageState: pointsPageReducer,
    authState: authReducer,
    form: formReducer,
    adminPageState: adminPageReducer,
});

let store = createStore(reducers);

window.store = store;

export default store;