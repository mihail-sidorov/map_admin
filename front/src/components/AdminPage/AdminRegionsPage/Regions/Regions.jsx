import React from 'react';
import RegionContainer from './Region/RegionContainer';

let Regions = (props) => {
    let addRegionBtn = [];
    addRegionBtn.push(<button className="regions__add-region-btn" key={1} onClick={() => {
        props.onOpenAddRegionForm();
    }}>Добавить</button>);

    let regionsArr = [];

    for (let id in props.regions) {
        let Region = RegionContainer(id);
        regionsArr.push(<Region key={id} />);
    }

    return (
        <div className="regions">
            {addRegionBtn}

            {regionsArr}
        </div>
    );
}

let RegionsRequest = class extends React.Component {
    componentDidMount() {
        this.props.onGetRegions();
    }

    render() {
        return <Regions {...this.props} />
    }
}

export default RegionsRequest;