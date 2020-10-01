import React from 'react';

let SearchAdmin = (props) => {
    return (
        <div className="search-admin search">
            <input type="text" className="search-admin__input search__input" value={props.search} onChange={(e) => {
                props.onChangeSearch(e.currentTarget.value);
            }} />
        </div>
    );
}

export default SearchAdmin;