import * as axios from 'axios';
import serverName from '../serverName';

const DEL_POINT = 'DEL_POINT', CHANGE_PAGE = 'CHANGE_PAGE', CHANGE_SEARCH = 'CHANGE_SEARCH', SHOW_ADD_EDIT_POINT_FORM = 'SHOW_ADD_EDIT_POINT_FORM', ADD_POINT = 'ADD_POINT', EDIT_POINT = 'EDIT_POINT';

let makeShortPoints = (state) => {
    let searchPoints = {}, shortPoints = {};

    if (state.search !== '') {
        for (let id in state.points) {
            let pattern = new RegExp(state.search.toLowerCase());
            if (state.points[id].title.toLowerCase().match(pattern)) {
                searchPoints[id] = state.points[id];
            }
        }
    }
    else {
        searchPoints = state.points;
    }

    let paginationCount = state.pagination.count;
    let currentPage = state.pagination.currentPage;
    
    let pages = Math.floor(Object.keys(searchPoints).length / paginationCount);
    if (Object.keys(searchPoints).length % paginationCount > 0) {
        pages++;
    }
    if (currentPage > pages || state.addEditPointForm.newPoint === true) {
        currentPage = pages;
    }

    let left = (currentPage - 1) * paginationCount + 1;
    let right = left + paginationCount - 1;
    let i = 1;

    for (let id in searchPoints) {
        if (i >= left && i <= right) {
            shortPoints[id] = searchPoints[id];
        }
        i++;
    }

    return {
        shortPoints: shortPoints,
        currentPage: currentPage,
        pages: pages,
    };
}

let initialState = {
    points: {
        1: {
            id: 1,
            lng: '99991',
            lat: '99991',
            title: 'title1',
            hours: 'hours1',
            phone: 'phone1',
            site: 'site1',
            description: 'description1',
        },
        2: {
            id: 2,
            lng: '99992',
            lat: '99992',
            title: 'title2',
            hours: 'hours2',
            phone: 'phone2',
            site: 'site2',
            description: 'description2',
        },
        3: {
            id: 3,
            lng: '99993',
            lat: '99993',
            title: 'title3',
            hours: 'hours3',
            phone: 'phone3',
            site: 'site3',
            description: 'description3',
        },
        4: {
            id: 4,
            lng: '99994',
            lat: '99994',
            title: 'title4',
            hours: 'hours4',
            phone: 'phone4',
            site: 'site4',
            description: 'description4',
        },
    },
    shortPoints: {},
    addEditPointForm: {
        action: null,
        point: {},
        newPoint: false,
    },
    search: '',
    pagination: {
        count: 2,
        currentPage: 1,
        pages: 0,
    },
};

let makeShortPointsResult = makeShortPoints(initialState);
initialState.shortPoints = makeShortPointsResult.shortPoints;
initialState.pagination.currentPage = makeShortPointsResult.currentPage;
initialState.pagination.pages = makeShortPointsResult.pages;

// Запросы к API
export let addPoint = (point) => {
    return axios.post(`${serverName}/api/addPoint`, {lng: point.lng, lat: point.lat, title: point.title, hours: point.hours, phone: point.phone, site: point.site,  description: point.description}, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response.id;
        }
        else {
            throw 'Ошибка авторизации!';
        }
    });
}

// Создание ActionCreator
export let delPointActionCreator = (id) => {
    return {
        type: DEL_POINT,
        id: id,
    };
}

export let changePageActionCreator = (page) => {
    return {
        type: CHANGE_PAGE,
        page: page,
    };
}

export let changeSearchActionCreator = (search) => {
    return {
        type: CHANGE_SEARCH,
        search: search,
    };
}

export let showAddEditPointFormActionCreator = (action, id = null) => {
    return {
        type: SHOW_ADD_EDIT_POINT_FORM,
        action: action,
        id: id,
    };
}

export let addPointActionCreator = (point) => {
    return {
        type: ADD_POINT,
        point: point,
    };
}

export let editPointActionCreator = (point) => {
    return {
        type: EDIT_POINT,
        point: point,
    };
}

let pointsPageReducer = (state = initialState, action) => {
    let newState, makeShortPointsResult;

    switch (action.type) {
        case DEL_POINT:
            newState = {...state};
            newState.points = {...state.points};
            delete newState.points[action.id];

            newState.addEditPointForm = {
                action: null,
                point: {},
                newPoint: false,
            };

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            return newState;
        case CHANGE_PAGE:
            newState = {...state};
            newState.pagination.currentPage = action.page;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            return newState;
        case CHANGE_SEARCH:
            newState = {...state};
            newState.search = action.search;
            newState.pagination.currentPage = 1;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            return newState;
        case SHOW_ADD_EDIT_POINT_FORM:
            newState = {...state};
            newState.addEditPointForm.action = action.action;

            if (action.action === null || action.action === 'add') {
                newState.addEditPointForm.point = {};
            }
            else {
                newState.addEditPointForm.point = {...newState.points[action.id]};
            }

            return newState;
        case ADD_POINT:
            newState = {...state};
            newState.points = {
                ...newState.points,
                577867: {...action.point, id: 577867},
            };

            newState.addEditPointForm.newPoint = true;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            newState.addEditPointForm = {
                action: null,
                point: {},
                newPoint: false,
            };

            return newState;
        case EDIT_POINT:
            newState = {...state};
            newState.points[action.point.id] = {...action.point};
            newState.shortPoints[action.point.id] = newState.points[action.point.id];

            newState.addEditPointForm = {
                action: null,
                point: {},
                newPoint: false,
            };

            return newState;
        default:
            return state;
    }
}

export default pointsPageReducer;