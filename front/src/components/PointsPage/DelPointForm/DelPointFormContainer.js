import { connect } from 'react-redux';
import { acceptPoint, closeDelPointFormActionCreator, delPoint, delPointActionCreator, editPointActionCreator } from '../../../redux/pointsPageReducer';
import DelPointFormModalWindow from './DelPointForm';

let DelPointFormContainer = connect(
    state => ({
        delPointForm: state.pointsPageState.delPointForm,
    }),
    dispatch => ({
        onCloseDelPointForm: () => {
            dispatch(closeDelPointFormActionCreator());
        },
        onDelPoint: (id, permission) => {
            if (permission === 'user') {
                delPoint(id)
                    .then((res) => {
                        if (res.delete) {
                            dispatch(delPointActionCreator(id));
                        }
                        else {
                            dispatch(editPointActionCreator(res.point));
                        }
                        dispatch(closeDelPointFormActionCreator());
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

            if (permission === 'moder') {
                acceptPoint(id)
                    .then(() => {
                        dispatch(delPointActionCreator(id));
                        dispatch(closeDelPointFormActionCreator());
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    })
)(DelPointFormModalWindow);

export default DelPointFormContainer;