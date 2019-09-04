import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import Links from '../shared/Links';
import Health from '../shared/Health';
import userStore from '../../stores/userStore';
import constants from '../../constants';

class EaArtifactDetails extends React.Component {
  async componentDidMount() {
    modelStore.loadEaArtifactDetail(this.props.eaArtifactId);
    // check if we can show health details to this user
    if (userStore.data.allowedFeatures
      .includes(constants.eaRefModelOverlayFeature.eaHealth)) {
      // don't need to await this, can finish whenever
      modelStore.loadEaHealthDetail(this.props.eaArtifactId);
    }
  }

  render() {
    const { eaArtifactId } = this.props;
    const artifact = modelStore.eaArtifactDetails.find(a => a.eaArtifactId === eaArtifactId);
    if (!artifact) {
      return null;
    }

    const health = modelStore.eaArtifactHealthDetails
      .find(h => h.eaArtifactId === eaArtifactId);

    return <div>
        <div className="Single-col-wrapper">
        <div className="Head-1">{artifact.name}</div>
        { !artifact.description ? undefined
          : <div className="Data-single-row">{artifact.description}</div>}
        <Links links={artifact.links} />
        { !health ? undefined
          : <div className="Data-block">
              <div className="Head-2">Health Assessment</div>
              <Health healthDetail={health}/>
            </div>}
      </div>
    </div>;
  }
}

export default observer(EaArtifactDetails);
