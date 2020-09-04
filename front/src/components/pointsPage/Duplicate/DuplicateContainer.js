import { connect } from 'react-redux';
import Duplicate from './Duplicate';
import { canselDuplicateActionCreator, addPoint, editPoint, addPointActionCreator, editPointActionCreator } from '../../../redux/pointsPageReducer';

let DuplicateContainer = connect(
    state => ({
        duplicate: state.pointsPageState.duplicate,
        action: state.pointsPageState.addEditPointForm.action,
    }),
    dispatch => ({
        addEditPoint: (action) => {
            let point = window.store.getState().pointsPageState.addEditPointForm.point;
            point.force = true;

            if (action === 'add') {
                addPoint(point)
                    .then((response) => {
                        if (response.point) {
                            dispatch(addPointActionCreator(response.point));
                            dispatch(canselDuplicateActionCreator());
                        }
                        else {
                            throw 'Что-то пошло не так!';
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

            if (action === 'edit') {
                editPoint(point, 'user')
                    .then((response) => {
                        if (response.point) {
                            dispatch(editPointActionCreator(response.point));
                            dispatch(canselDuplicateActionCreator());
                        }
                        else {
                            throw 'Что-то пошло не так!';
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        cansel: () => {
            dispatch(canselDuplicateActionCreator());
        },
    }),
)(Duplicate);

export default DuplicateContainer;