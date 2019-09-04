import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import EADomain from './EADomain';
import EARefModelOverlays from './EARefModelOverlays';

class EARefModel extends React.Component {
  async componentDidMount() {
    await modelStore.loadEaDomains();
  }

  render() {
    const crossCuttingDomains = modelStore.eaDomains
      .filter(ead => ead.isCrossCutting)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map(d => <EADomain domain={d} key={d.eaDomainId} />);
    const normalDomains = modelStore.eaDomains
      .filter(ead => !ead.isCrossCutting)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map(d => <EADomain domain={d} key={d.eaDomainId} />);
    return <div className="EA-ref-model">
      <EARefModelOverlays/>
      <div className="EA-domains-cross-cutting">
        {crossCuttingDomains}
      </div>
      <div className="EA-domains">
        {normalDomains}
      </div>
    </div>;
  }
}

export default observer(EARefModel);
