import React from 'react';

let Region = (props) => {
    return (
        <div className="region list__item">
            <span className="region__name list__item-part">{props.region.region}</span>
            <button className="region__edit-btn list__item-btn list__item-btn_edit" onClick={() => {
                props.onOpenEditRegionForm(props.region);
            }}></button>
        </div>
    );
}

export default Region;