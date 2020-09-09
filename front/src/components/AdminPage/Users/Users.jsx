import React from 'react';
import UserContainer from './User/UserContainer';

let UsersRequest = class extends React.Component {
    componentDidMount() {
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
    addUserBtn.push(<button className="users__add-user-btn" key={1} onClick={() => {
        props.onOpenAddUserForm();
    }}>Добавить</button>);

    let usersArr = [];

    for (let id in props.users) {
        let User = UserContainer(id);
        usersArr.push(<User key={id} />);
    }

    return (
        <div className="users">
            {addUserBtn}

            {usersArr}
        </div>
    );
}

export default UsersRequest;