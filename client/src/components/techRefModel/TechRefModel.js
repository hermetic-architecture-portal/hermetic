import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import TechRefModelLayer from './TechRefModelLayer';
import TechRefModelOverlays from './TechRefModelOverlays';

class TechRefModel extends React.Component {
  componentDidMount() {
    modelStore.loadTechRefModel();
    modelStore.loadTechnologies();
  }

  render() {
    const layers = modelStore.techRefModelLayers
      .map(layer => <TechRefModelLayer layer={layer} key={layer.trmLayerId} />);
    return <div>
      <TechRefModelOverlays/>
      <div>
        {layers}
      </div>
    </div>;
  }
}

export default observer(TechRefModel);
