import React from 'react';

let User = (props) => {
    return (
        <div className="user list__item">
            <span className="user__email list__item-part">{props.user.email}</span>
            <span className="user__permission list__item-part">{props.user.permission}</span>
            <span className="user__permission list__item-part">{props.user.region}</span>
            <button className="user__edit-btn list__item-btn list__item-btn_edit" onClick={() => {
                props.onOpenEditUserForm(props.user.id);
            }}></button>
            {/* {props.user.permission !== 'admin' && (
                <button className="user__login-as-btn" onClick={() => {
                    props.onLoginAs(props.user.id);
                }}>Войти под</button>
            )} */}
        </div>
    );
}

export default User;