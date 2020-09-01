import { connect } from 'react-redux';
import AddEditPointForm from './AddEditPoinForm';
import { showAddEditPointFormActionCreator, addPoint, addPointActionCreator, editPointActionCreator, editPoint } from '../../../redux/pointsPageReducer';

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
        addEditPoint: (values, action) => {
            console.log(values);
            if (values.lng && values.lat && values.apartment && values.title && values.hours && values.phone && values.site && values.description) {
                if (action === 'add') {
                    if (values.isActive === undefined) values.isActive = false;
                    addPoint(values)
                    .then((point) => {
                        dispatch(addPointActionCreator(point));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
                if (action === 'edit') {
                    editPoint(values)
                    .then((point) => {
                        dispatch(editPointActionCreator(point));
                    });
                }
            }
        },
    };
}

let AddEditPointFormContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditPointForm);

export default AddEditPointFormContainer;