import React from 'react';
import RegionContainer from './Region/RegionContainer';

let Regions = (props) => {
    let addRegionBtn = [];
    addRegionBtn.push(<button className="regions__add-region-btn btn" key={1} onClick={() => {
        props.onOpenAddRegionForm();
    }}>Добавить регион</button>);

    let regionsArr = [];

    for (let id in props.regions) {
        let Region = RegionContainer(id);
        regionsArr.push(<Region key={id} />);
    }

    return (
        <div className="regions list">
            {addRegionBtn}
            <div className="regions__titles list__titles">
                <div className="regions__title list__title">Регион</div>
            </div>
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