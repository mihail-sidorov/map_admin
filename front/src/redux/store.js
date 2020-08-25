import {createStore, combineReducers} from 'redux';
import pointsPageReducer from './pointsPageReducer';
import authReducer from './authReducer';
import {reducer as formReducer} from 'redux-form';


let reducers = combineReducers({
    pointsPageState: pointsPageReducer,
    authState: authReducer,
    form: formReducer,
});

let store = createStore(reducers);

window.store = store;

export default store;