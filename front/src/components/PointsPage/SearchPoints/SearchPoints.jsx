import React from 'react';

let SearchPoints = (props) => {
    let onChangeSearch = (e) => {
        props.changeSearch(e.currentTarget.value);
    }

    return (
        <div className="search-points search">
            <input type="text" className="search-points__input search__input" value={props.search} onChange={onChangeSearch} />
        </div>
    );
}

export default SearchPoints;