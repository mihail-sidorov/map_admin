import * as axios from 'axios';
import serverName from '../serverName';

const CHANGE_SEARCH_ADMIN_REGIONS = 'CHANGE_SEARCH_ADMIN_REGIONS', GET_REGIONS = 'GET_REGIONS', CHANGE_PAGE_ADMIN_REGIONS = 'CHANGE_PAGE_ADMIN_REGIONS', OPEN_ADD_REGION_FORM = 'OPEN_ADD_REGION_FORM', ADD_REGION = 'ADD_REGION', CANSEL_ADD_REGION = '', EDIT_REGION = 'EDIT_REGION', OPEN_EDIT_REGION_FORM = 'OPEN_EDIT_REGION_FORM', CANSEL_EDIT_REGION = 'CANSEL_EDIT_REGION';

let makeShortRegions = (state) => {
    let searchRegions = {}, shortRegions = {};

    if (state.search !== '') {
        for (let id in state.regions) {
            let pattern = new RegExp(state.search.toLowerCase()), searchStr = '';

            for (let property in state.regions[id]) {
                if (property === 'region') {
                    if (state.regions[id][property] !== undefined && state.regions[id][property] !== null && state.regions[id][property] !== '') {
                        searchStr += state.regions[id][property];
                    }
                }
            }

            if (searchStr.toLowerCase().match(pattern)) {
                searchRegions[id] = state.regions[id];
            }
        }
    }
    else {
        searchRegions = state.regions;
    }

    let paginationCount = state.pagination.count;
    let currentPage = state.pagination.currentPage;
    
    let pages = Math.floor(Object.keys(searchRegions).length / paginationCount);
    if (Object.keys(searchRegions).length % paginationCount > 0) {
        pages++;
    }
    if (currentPage > pages || state.addRegionForm.newRegion === true) {
        currentPage = pages;
    }

    if (currentPage === 0) currentPage = 1;

    let left = (currentPage - 1) * paginationCount + 1;
    let right = left + paginationCount - 1;
    let i = 1;

    for (let id in searchRegions) {
        if (i >= left && i <= right) {
            shortRegions[id] = searchRegions[id];
        }
        i++;
    }

    return {
        shortRegions: shortRegions,
        currentPage: currentPage,
        pages: pages,
    };
}

let initialState = {
    regions: {},
    shortRegions: {},
    search: '',
    pagination: {
        count: 1,
        currentPage: 1,
        pages: 0,
    },
    addRegionForm: {
        open: false,
        newRegion: false,
    },
    editRegionForm: {
        open: false,
        region: {},
    },
};

// Запросы к API
export let getRegions = () => {
    return axios.get(`${serverName}/api/admin/getRegions`, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response;
        }
        else {
            throw 'Не удалось получить регионы!';
        }
    });
}

export let addRegion = (data) => {
    return axios.post(`${serverName}/api/admin/addRegion`, data, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response[0];
        }
        else {
            throw 'Не удалось добавить регион!';
        }
    });
}

export let editRegion = (data) => {
    return axios.post(`${serverName}/api/admin/editRegion`, data, {withCredentials: true}).then((response) => {
        if (!response.data.isError) {
            return response.data.response[0];
        }
        else {
            throw 'Не удалось отредактировать регион!';
        }
    });
}

// Создание ActionCreator
export let changeSearchAdminRegionsActionCreator = (value) => ({
    type: CHANGE_SEARCH_ADMIN_REGIONS,
    value: value,
})

export let getRegionsActionCreator = (regionsArr) => ({
    type: GET_REGIONS,
    regionsArr: regionsArr,
})

export let changePageAdminRegionsActionCreator = (page) => ({
    type: CHANGE_PAGE_ADMIN_REGIONS,
    page: page,
})

export let openAddRegionFormActionCreator = () => ({
    type: OPEN_ADD_REGION_FORM,
})

export let addRegionActionCreator = (region) => ({
    type: ADD_REGION,
    region: region,
})

export let canselAddRegionActionCreator = () => ({
    type: CANSEL_ADD_REGION,
})

export let openEditRegionFormActionCreator = (region) => ({
    type: OPEN_EDIT_REGION_FORM,
    region: region,
})

export let editRegionActionCreator = (region) => ({
    type: EDIT_REGION,
    region: region,
})

export let canselEditRegionActionCreator = () => ({
    type: CANSEL_EDIT_REGION,
})

let adminRegionsPageReducer = (state = initialState, action) => {
    let newState, makeShortRegionsResult;

    switch (action.type) {
        case CHANGE_SEARCH_ADMIN_REGIONS:
            newState = {...state};
            newState.search = action.value;
            newState.pagination.currentPage = 1;

            makeShortRegionsResult = makeShortRegions(newState);
            newState.shortRegions = makeShortRegionsResult.shortRegions;
            newState.pagination.currentPage = makeShortRegionsResult.currentPage;
            newState.pagination.pages = makeShortRegionsResult.pages;

            return newState;
        case GET_REGIONS:
            let regions = {};
            action.regionsArr.forEach((region) => {
                regions[region.id] = region;
            });

            newState = {...state};
            newState.regions = regions;

            makeShortRegionsResult = makeShortRegions(newState);
            newState.shortRegions = makeShortRegionsResult.shortRegions;
            newState.pagination.currentPage = makeShortRegionsResult.currentPage;
            newState.pagination.pages = makeShortRegionsResult.pages;

            return newState;
        case CHANGE_PAGE_ADMIN_REGIONS:
            newState = {...state};
            newState.pagination.currentPage = action.page;

            makeShortRegionsResult = makeShortRegions(newState);
            newState.shortRegions = makeShortRegionsResult.shortRegions;
            newState.pagination.currentPage = makeShortRegionsResult.currentPage;
            newState.pagination.pages = makeShortRegionsResult.pages;

            return newState;
        case OPEN_ADD_REGION_FORM:
            return {
                ...state,
                addRegionForm: {
                    ...state.addRegionForm,
                    open: true,
                },
            };
        case ADD_REGION:
            newState = {...state};
            newState.regions[action.region.id] = action.region;

            newState.addRegionForm.newRegion = true;

            makeShortRegionsResult = makeShortRegions(newState);
            newState.shortRegions = makeShortRegionsResult.shortRegions;
            newState.pagination.currentPage = makeShortRegionsResult.currentPage;
            newState.pagination.pages = makeShortRegionsResult.pages;

            newState.addRegionForm.newRegion = false;
            newState.addRegionForm.open = false;

            return newState;
        case CANSEL_ADD_REGION:
            return {
                ...state,
                addRegionForm: {
                    ...state.addRegionForm,
                    open: false,
                },
            };
        case OPEN_EDIT_REGION_FORM:
            return {
                ...state,
                editRegionForm: {
                    open: true,
                    region: action.region,
                },
            };
        case EDIT_REGION:
            newState = {...state};
            newState.regions[action.region.id] = action.region;
            newState.shortRegions[action.region.id] = action.region;
            newState.editRegionForm = {
                ...newState.editRegionForm,
                open: false,
            };

            return newState;
        case CANSEL_EDIT_REGION:
            return {
                ...state,
                editRegionForm: {
                    ...state.editRegionForm,
                    open: false,
                },
            };
        default:
            return state;
    }
}

export default adminRegionsPageReducer;