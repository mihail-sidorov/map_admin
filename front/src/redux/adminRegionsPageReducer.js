import * as axios from 'axios';
import serverName from '../serverName';

const CHANGE_SEARCH_ADMIN_REGIONS = 'CHANGE_SEARCH_ADMIN_REGIONS', GET_REGIONS = 'GET_REGIONS', CHANGE_PAGE_ADMIN_REGIONS = 'CHANGE_PAGE_ADMIN_REGIONS';

let makeShortRegions = (state) => {
    let searchRegions = {}, shortRegions = {};

    if (state.search !== '') {
        for (let id in state.regions) {
            let pattern = new RegExp(state.search.toLowerCase());
            let region;


            for (let property in state.regions[id]) {
                switch (property) {
                    case 'region':
                        region = state.regions[id][property];
                        break;
                    default:
                        break;
                }
            }

            let searchStr = region;

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
        count: 2,
        currentPage: 1,
        pages: 0,
    },
    addRegionForm: {
        open: false,
        newRegion: false,
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

let adminRegionsPageReducer = (state = initialState, action) => {
    let newState, makeShortRegionsResult;

    switch (action.type) {
        case CHANGE_SEARCH_ADMIN_REGIONS:
            newState = {...state};
            newState.search = action.value;

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
        default:
            return state;
    }
}

export default adminRegionsPageReducer;