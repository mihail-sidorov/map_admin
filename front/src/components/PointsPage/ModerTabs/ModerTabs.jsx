import React from 'react';

let ModerTabs = (props) => {
    console.log(props.moderTabs);

    return (
        props.moderTabs &&
        <div className="moder-tabs">
            <div className="moder-tabs__tab">Модерация</div>
            <div className="moder-tabs__tab">Точки</div>
        </div>
    );
}

export default ModerTabs;