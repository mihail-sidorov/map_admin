import React from 'react';

let User = (props) => {
    return (
        <div className="user">
            <span className="user__email">{props.user.email}</span>
            <span className="user__permission">{props.user.permission}</span>
            <hr />
        </div>
    );
}

export default User;