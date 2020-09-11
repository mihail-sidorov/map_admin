import { connect } from 'react-redux';
import AdminPage from './AdminPage';
import authHOC from '../../HOC/authHOC';

let AdminPageContainer = connect(
    state => ({
        permission: state.authState.permission,
        loginAs: state.adminPageState.loginAs,
    }),
    dispatch => ({

    }),
)(AdminPage);

AdminPageContainer = authHOC(AdminPageContainer);

export default AdminPageContainer;