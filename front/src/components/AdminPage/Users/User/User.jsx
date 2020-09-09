import React from 'react';

let User = (props) => {
    return (
        <div className="user">
            <span className="user__email">{props.user.email}</span>
            <span className="user__permission">{props.user.permission}</span>
            <button className="user__edit-btn" onClick={() => {
                props.onOpenEditUserForm(props.user.id);
            }}>Редактировать</button>
            <hr />
        </div>
    );
}

export default User;