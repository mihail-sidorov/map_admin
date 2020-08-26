import {createStore, combineReducers} from 'redux';
import pointsPageReducer from './pointsPageReducer';
import authReducer from './authReducer';
import {reducer as formReducer} from 'redux-form';
import * as axios from 'axios';


let reducers = combineReducers({
    pointsPageState: pointsPageReducer,
    authState: authReducer,
    form: formReducer,
});

let store = createStore(reducers);

axios.get('http://mapadmin.karmydev.ru/api/getAuthData').then((response) => {
    let state = store.getState();
    state.authState = {
        ...state.authState,
        ...response.data,
    };
});

axios.post('http://mapadmin.karmydev.ru/api/login', {email: 'admin@admin.admin', password: 'adminadmin'}).then((response) => {
    console.log(response);
});

window.store = store;

export default store;