import * as axios from 'axios';
import serverName from '../serverName';

const DEL_POINT = 'DEL_POINT', CHANGE_PAGE = 'CHANGE_PAGE', CHANGE_SEARCH = 'CHANGE_SEARCH', SHOW_ADD_EDIT_POINT_FORM = 'SHOW_ADD_EDIT_POINT_FORM', ADD_POINT = 'ADD_POINT', EDIT_POINT = 'EDIT_POINT', GET_POINTS = 'GET_POINTS', ADD_DUPLICATE = 'ADD_DUPLICATE', CANSEL_DUPLICATE = 'CANSEL_DUPLICATE', RESET_CURRENT_PAGE_POINTS = 'RESET_CURRENT_PAGE_POINTS';

let makeShortPoints = (state) => {
    let searchPoints = {}, shortPoints = {};

    if (state.search !== '') {
        for (let id in state.points) {
            let pattern = new RegExp(state.search.toLowerCase());
            let full_city_name, street, house, apartment, lng, lat, title, hours, phone, site;


            for (let property in state.points[id]) {
                switch (property) {
                    case 'full_city_name':
                        full_city_name = state.points[id][property];
                        break;
                    case 'street':
                        street = state.points[id][property];
                        break;
                    case 'house':
                        house = state.points[id][property];
                        break;
                    case 'apartment':
                        apartment = state.points[id][property];
                        break;
                    case 'lng':
                        lng = state.points[id][property];
                        break;
                    case 'lat':
                        lat = state.points[id][property];
                        break;
                    case 'title':
                        title = state.points[id][property];
                        break;
                    case 'hours':
                        hours = state.points[id][property];
                        break;
                    case 'phone':
                        phone = state.points[id][property];
                        break;
                    case 'site':
                        site = state.points[id][property];
                        break;
                    default:
                        break;
                }
            }

            let searchStr = full_city_name + street + house + apartment + lng + lat + title + hours + phone + site;

            if (searchStr.toLowerCase().match(pattern)) {
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

let resetAddEditPointForm = () => {
    return {
        action: null,
        point: {},
        newPoint: false,
    };
}

let initialState = {
    points: {},
    duplicate: {},
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

// Запросы к API
export let addPoint = (point) => {
    return axios.post(`${serverName}/api/user/addPoint`, point, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return {
                point: response.data.response[0],
            };
        }
        else {
            if (response.data.response.duplicate) {
                return {
                    duplicate: response.data.response.duplicate,
                }
            }
        }

        throw 'Не удалось добавить точку!';
    });
}

export let editPoint = (point, permission) => {
    return axios.post(`${serverName}/api/${permission}/editPoint/${point.id}`, point, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            if (permission === 'user') {
                return {
                    point: response.data.response[0],
                };
            }
            if (permission === 'moder') {
                return {
                    id: response.data.response,
                };
            }
        }
        else {
            if (response.data.response.duplicate) {
                return {
                    duplicate: response.data.response.duplicate,
                }
            }
        }

        if (permission === 'user') {
            throw 'Не удалось отредактировать точку!';
        }
        if (permission === 'moder') {
            throw 'Не удалось промодерировать точку!';
        }
    });
}

export let getPoints = (permission) => {
    return axios.get(`${serverName}/api/${permission}/getPoints`, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось получить точки!';
        }
    });
}

export let delPoint = (id) => {
    return axios.post(`${serverName}/api/user/delPoint`, {id: id}, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return id;
        }
        else {
            throw 'Не удалось удалить точку!';
        }
    });
}

export let refusePoint = (data) => {
    return axios.post(`${serverName}/api/moder/setPointRefuse`, data, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось отклонить точку!';
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

export let getPointsActionCreator = (pointsArr) => {
    return {
        type: GET_POINTS,
        pointsArr: pointsArr,
    };
}

export let addDuplicateActionCreator = (duplicate, point) => {
    return {
        type: ADD_DUPLICATE,
        duplicate: duplicate,
        point: point,
    };
}

export let canselDuplicateActionCreator = () => {
    return {
        type: CANSEL_DUPLICATE,
    };
}

export let resetCurrentPagePointsActionCreator = () => ({
    type: RESET_CURRENT_PAGE_POINTS,
})

let pointsPageReducer = (state = initialState, action) => {
    let newState, makeShortPointsResult;

    switch (action.type) {
        case DEL_POINT:
            newState = {...state};
            newState.points = {...state.points};
            delete newState.points[action.id];

            newState.addEditPointForm = resetAddEditPointForm();

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
            newState.points[action.point.id] = action.point;

            newState.addEditPointForm.newPoint = true;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            newState.addEditPointForm = resetAddEditPointForm();

            return newState;
        case EDIT_POINT:
            newState = {...state};
            newState.points[action.point.id] = {...action.point};
            newState.shortPoints[action.point.id] = newState.points[action.point.id];

            newState.addEditPointForm = resetAddEditPointForm();

            return newState;
        case GET_POINTS:
            let points = {};
            action.pointsArr.forEach((point) => {
                points[point.id] = point;
            });

            newState = {...state};
            newState.points = points;

            makeShortPointsResult = makeShortPoints(newState);
            newState.shortPoints = makeShortPointsResult.shortPoints;
            newState.pagination.currentPage = makeShortPointsResult.currentPage;
            newState.pagination.pages = makeShortPointsResult.pages;

            return newState;
        case ADD_DUPLICATE:
            newState = {...state};
            newState.duplicate = {...action.duplicate};

            newState.addEditPointForm.point = {...action.point};
            
            return newState;
        case CANSEL_DUPLICATE:
            return {
                ...state,
                duplicate: {},
            };
        case RESET_CURRENT_PAGE_POINTS:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    currentPage: 1,
                },
            };
        default:
            return state;
    }
}

export default pointsPageReducer;