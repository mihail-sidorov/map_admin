import { connect } from 'react-redux';
import AddEditPointForm from './AddEditPoinForm';
import { showAddEditPointFormActionCreator } from '../../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        action: state.pointsPageState.addEditPointForm.action,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        closeAddEditPointForm: (action) => {
            dispatch(showAddEditPointFormActionCreator(action));
        },
        AddEditPoint: (data) => {
            console.log(data);
        },
    };
}

let AddEditPointFormContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditPointForm);

export default AddEditPointFormContainer;