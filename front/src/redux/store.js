import {createStore, combineReducers} from 'redux';
import pointsPageReducer from './pointsPageReducer';
import authReducer from './authReducer';
import {reducer as formReducer} from 'redux-form';
import adminPageReducer from './adminPageReducer';
import adminRegionsPageReducer from './adminRegionsPageReducer';

let reducers = combineReducers({
    pointsPageState: pointsPageReducer,
    authState: authReducer,
    form: formReducer,
    adminPageState: adminPageReducer,
    adminRegionsPageState: adminRegionsPageReducer,
});

let store = createStore(reducers);

window.store = store;

export default store;