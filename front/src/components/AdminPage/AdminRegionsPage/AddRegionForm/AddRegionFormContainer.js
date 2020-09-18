import { connect } from 'react-redux';
import AddRegionForm from './AddRegionForm';
import {addRegion, addRegionActionCreator} from '../../../../redux/adminRegionsPageReducer';

let AddRegionFormContainer = connect(
    state => ({
        open: state.adminRegionsPageState.addRegionForm.open,
    }),
    dispatch => ({
        onAddRegion: (values) => {
            if (values.region) {
                addRegion(values)
                    .then((region) => {
                        dispatch(addRegionActionCreator(region));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
    })
)(AddRegionForm);

export default AddRegionFormContainer;