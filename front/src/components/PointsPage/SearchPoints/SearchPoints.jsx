import React from 'react';

let SearchPoints = (props) => {
    let onChangeSearch = (e) => {
        props.changeSearch(e.currentTarget.value);
    }

    return (
        <div className="search-points">
            <input type="text" className="search-points__input" value={props.search} onChange={onChangeSearch} />
        </div>
    );
}

export default SearchPoints;