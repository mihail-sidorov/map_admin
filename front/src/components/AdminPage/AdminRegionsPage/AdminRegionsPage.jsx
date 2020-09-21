import React from 'react';
import AddRegionFormContainer from './AddRegionForm/AddRegionFormContainer';
import EditRegionFormContainer from './EditRegionForn/EditRegionFormContainer';
import PaginationContainer from './Pagination/PaginationContainer';
import RegionsContainer from './Regions/RegionsContainer';
import SearchAdminRegionsContainer from './SearchAdminRegions/SearchAdminRegionsContainer';

let AdminRegionsPage = (props) => {
    return (
        <div className="admin-regions-page">
            <SearchAdminRegionsContainer />
            <RegionsContainer />
            <PaginationContainer />
            <AddRegionFormContainer />
            <EditRegionFormContainer />
        </div>
    );
}

export default AdminRegionsPage;