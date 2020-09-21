import { connect } from 'react-redux';
import { openEditRegionFormActionCreator } from '../../../../../redux/adminRegionsPageReducer';
import Region from './Region';

let RegionContainer = (id) => {
    return connect(
        state => ({
            region: state.adminRegionsPageState.shortRegions[id],
        }),
        dispatch => ({
            onOpenEditRegionForm: (region) => {
                dispatch(openEditRegionFormActionCreator(region));
            },
        })
    )(Region);
}

export default RegionContainer;