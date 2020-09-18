import React from 'react';
import PaginationContainer from './Pagination/PaginationContainer';
import RegionsContainer from './Regions/RegionsContainer';
import SearchAdminRegionsContainer from './SearchAdminRegions/SearchAdminRegionsContainer';

let AdminRegionsPage = (props) => {
    return (
        <div className="admin-regions-page">
            <SearchAdminRegionsContainer />
            <RegionsContainer />
            <PaginationContainer />
        </div>
    );
}

export default AdminRegionsPage;