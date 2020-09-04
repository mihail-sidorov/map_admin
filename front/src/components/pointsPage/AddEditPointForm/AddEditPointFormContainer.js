import { connect } from 'react-redux';
import AddEditPointForm from './AddEditPoinForm';
import { showAddEditPointFormActionCreator, addPoint, addPointActionCreator, editPointActionCreator, editPoint, addDuplicateActionCreator, delPointActionCreator } from '../../../redux/pointsPageReducer';

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
        addEditPoint: (values, action, permission) => {
            console.log(values);

            let point = null;

            if (!values.apartments) values.apartments = '';

            if (permission === 'user') {
                if (values.lng && values.lat && values.title && values.hours && values.phone && values.site) {
                    if (!values.description) values.description = '';
                    if (!values.isActive) values.isActive = false;
                    point = values;
                }
                if (action === 'add' && point) {
                    addPoint(point)
                    .then((response) => {
                        if (response.point) {
                            dispatch(addPointActionCreator(response.point));
                        }
                        if (response.duplicate) {
                            dispatch(addDuplicateActionCreator(response.duplicate, point));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
            }

            if (permission === 'moder') {
                if (values.full_city_name && values.street && values.house && values.title && values.hours && values.phone && values.site) {
                    point = values;
                }
            }

            if (action === 'edit' && point) {
                editPoint(point, permission)
                .then((response) => {
                    if (response.point) {
                        dispatch(editPointActionCreator(response.point));
                    }
                    if (response.duplicate) {
                        dispatch(addDuplicateActionCreator(response.duplicate, point));
                    }
                    if (response.id) {
                        dispatch(delPointActionCreator(response.id));
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        },
    };
}

let AddEditPointFormContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditPointForm);

export default AddEditPointFormContainer;