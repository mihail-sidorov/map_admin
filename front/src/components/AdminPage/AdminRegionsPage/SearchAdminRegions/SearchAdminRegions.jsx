import React, { useEffect } from 'react';

let SearchAdminRegions = (props) => {
    return (
        <div className="search-admin-regions search">
            <input type="text" className="search-admin-regions__input search__input" name="name" value={props.search} onChange={(e) => {
                props.onChangeSearch(e.currentTarget.value);
            }} />
        </div>
    );
}

export default SearchAdminRegions;