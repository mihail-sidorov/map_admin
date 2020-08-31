import { connect } from 'react-redux';
import AddEditPointForm from './AddEditPoinForm';
import { showAddEditPointFormActionCreator, addPoint, addPointActionCreator, editPointActionCreator } from '../../../redux/pointsPageReducer';

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
            if (values.lng && values.lat && values.title && values.hours && values.phone && values.site && values.description) {
                if (action === 'add') {
                    // addPoint(values)
                    // .then((id) => {
                    //     console.log(id);
                    // })
                    // .catch((error) => {
                    //     console.log(error);
                    // });
                    dispatch(addPointActionCreator(values));
                }
                if (action === 'edit') {
                    dispatch(editPointActionCreator(values));
                }
            }
        },
    };
}

let AddEditPointFormContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditPointForm);

export default AddEditPointFormContainer;