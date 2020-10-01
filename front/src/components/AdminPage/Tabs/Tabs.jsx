import React from 'react';
import { NavLink } from 'react-router-dom';

let Tabs = (props) => {
    return (
        <div className="admin-page__tabs tabs">
            <div className={`admin-page__tab tabs__tab${props.tabs === 1 ? ' tabs__tab_active' : ''}`}>
                <NavLink to="/admin/users" className="tabs__tab-link">Список пользователей</NavLink>
            </div>
            <div className="admin-page__tab tabs__tab">
                <NavLink to="/admin/regions" className="tabs__tab-link">Список регионов</NavLink>
            </div>
        </div>
    );
}

export default Tabs;