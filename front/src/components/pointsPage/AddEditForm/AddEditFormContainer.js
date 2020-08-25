import { connect } from 'react-redux';
import AddEditForm from './AddEditForm';
import {canselActionCreator, changeCityActionCreator, changeNameActionCreator, changeLongActionCreator, changeLatActionCreator, addEditPointActionCreator} from '../../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        addEditForm: state.pointsPageState.addEditForm,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        canselAction: () => {
            dispatch(canselActionCreator());
        },
        changeCity: (text) => {
            dispatch(changeCityActionCreator(text));
        },
        changeName: (text) => {
            dispatch(changeNameActionCreator(text));
        },
        changeLong: (text) => {
            dispatch(changeLongActionCreator(text));
        },
        changeLat: (text) => {
            dispatch(changeLatActionCreator(text));
        },
        addEditPoint: () => {
            dispatch(addEditPointActionCreator());
        },
    };
}

const AddEditFormContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditForm);

export default AddEditFormContainer;