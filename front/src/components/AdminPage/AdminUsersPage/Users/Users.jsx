import React from 'react';
import UserContainer from './User/UserContainer';

let UsersRequest = class extends React.Component {
    componentDidMount() {
        console.log('componentDidMount');
        this.props.getUsers();
    }

    render() {
        return (
            <Users {...this.props} />
        );
    }
}

let Users = (props) => {
    let addUserBtn = [];
    addUserBtn.push(<button className="users__add-user-btn btn" key={1} onClick={() => {
        props.onOpenAddUserForm();
    }}>Добавить пользователя</button>);

    let usersArr = [];

    for (let id in props.users) {
        let User = UserContainer(id);
        usersArr.push(<User key={id} />);
    }

    return (
        <div className="users list">
            {addUserBtn}
            <div className="users__titles list__titles">
                <div className="users__title list__title">Имя пользователя</div>
                <div className="users__title list__title">Роль пользователя</div>
                <div className="users__title list__title">Регион пользователя</div>
            </div>
            {usersArr}
        </div>
    );
}

export default UsersRequest;