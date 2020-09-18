import React from 'react';

let Region = (props) => {
    return (
        <div className="region">
            <span className="region__name">{props.region.region}</span>
            <button className="region__edit-btn" onClick={() => {
                props.onOpenEditRegionForm(props.region.id);
            }}>Редактировать</button>
            <hr />
        </div>
    );
}

export default Region;