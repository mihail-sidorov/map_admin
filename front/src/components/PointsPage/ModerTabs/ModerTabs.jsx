import React from 'react';

let ModerTabs = (props) => {
    console.log(props.moderTabs);

    return (
        props.moderTabs &&
        <div className="moder-tabs tabs">
            <div className={`moder-tabs__tab tabs__tab${props.moderTabsActive === 1 ? ' tabs__tab_active' : ''}`} onClick={() => {
                props.onGoToModer();
            }}><span className="tabs__tab-link">Модерация</span></div>
            <div className={`moder-tabs__tab tabs__tab${props.moderTabsActive === 2 ? ' tabs__tab_active' : ''}`} onClick={() => {
                props.onGoToPoints();
            }}><span className="tabs__tab-link">Точки</span></div>
        </div>
    );
}

export default ModerTabs;