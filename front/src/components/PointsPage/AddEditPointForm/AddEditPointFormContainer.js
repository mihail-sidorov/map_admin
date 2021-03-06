import { connect } from 'react-redux';
import AddEditPointFormModalWindow from './AddEditPoinForm';
import { showAddEditPointFormActionCreator, addPoint, addPointActionCreator, editPointActionCreator, editPoint, addDuplicateActionCreator, delPointActionCreator } from '../../../redux/pointsPageReducer';

let mapStateToProps = (state) => {
    return {
        action: state.pointsPageState.addEditPointForm.action,
        open: state.pointsPageState.addEditPointForm.open,
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

            if (permission === 'user') {
                if (values.lng && values.lat) {
                    if (String(values.lng).match(/^[0-9]+\.[0-9]{4,}$/) && String(values.lat).match(/^[0-9]+\.[0-9]{4,}$/)) {
                        if (!values.description) values.description = '';
                        if (!values.isActive) values.isActive = false;
                        point = values;
                    }
                    else {
                        alert('У координат должно быть от 4 и более цифр после точки!');
                    }
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
                if (values.full_city_name && values.street && values.house) {
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

let AddEditPointFormContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditPointFormModalWindow);

export default AddEditPointFormContainer;