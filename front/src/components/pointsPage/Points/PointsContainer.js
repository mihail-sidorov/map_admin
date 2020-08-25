import { connect } from 'react-redux';
import Points from './Points';

let mapStateToProps = (state) => {
    return {
        points: state.pointsPageState.shortPoints,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        
    };
}

const PointsContainer = connect(mapStateToProps, mapDispatchToProps)(Points);

export default PointsContainer;