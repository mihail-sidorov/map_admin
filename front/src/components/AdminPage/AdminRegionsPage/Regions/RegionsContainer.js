import { connect } from 'react-redux';
import { getRegions, getRegionsActionCreator, openAddRegionFormActionCreator } from '../../../../redux/adminRegionsPageReducer';
import RegionsRequest from './Regions';

let RegionsContainer = connect(
    state => ({
        regions: state.adminRegionsPageState.shortRegions,
    }),
    dispatch => ({
        onOpenAddRegionForm: () => {
            dispatch(openAddRegionFormActionCreator());
        },
        onGetRegions: () => {
            getRegions()
                .then((regionsArr) => {
                    dispatch(getRegionsActionCreator(regionsArr));
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    })
)(RegionsRequest);

export default RegionsContainer;