import React from 'react';

let ModerTabs = (props) => {
    console.log(props.moderTabs);

    return (
        props.moderTabs &&
        <div className="moder-tabs">
            <div className="moder-tabs__tab" onClick={() => {
                props.onGoToModer();
            }}>Модерация</div>
            <div className="moder-tabs__tab" onClick={() => {
                props.onGoToPoints();
            }}>Точки</div>
        </div>
    );
}

export default ModerTabs;