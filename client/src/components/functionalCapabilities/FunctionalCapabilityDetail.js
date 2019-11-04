import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';

class FunctionalCapabilityDetail extends React.Component {
  componentDidMount() {
    modelStore.loadFunctionalCapabilityDetail(this.props.functionalCapabilityId);
  }

  render() {
    const { functionalCapabilityId } = this.props;
    const capability = modelStore.functionalCapabilityDetails
      .find(m => m.functionalCapabilityId === functionalCapabilityId);
    if (!capability) {
      return null;
    }

    const technologiesJsx = capability.technologies.map((tech) => {
      let remarks;
      if (tech.remarks) {
        remarks = <ul><li>{tech.remarks}</li></ul>;
      }
      return <li key={tech.technologyId}>
        <Link to={`/technology/${tech.technologyId}`}>
          {tech.name}
        </Link>
        {remarks}
      </li>;
    });

    if (technologiesJsx.length > 1) {
      const compareParams = capability.technologies
        .map(t => `technologyId=${t.technologyId}`)
        .join('&');
      technologiesJsx.push(<li key="compare" className="Functional-capability-compare" >
        <Link to={`/compareTechnologies?${compareParams}`}>
          Compare
        </Link>
      </li>);
    }

    return <div>
        <div className="Single-col-wrapper">
        <div className="Head-1">{capability.name}</div>
        { !capability.description ? undefined
          : <div className="Data-single-row">{capability.description}</div>}
        { !technologiesJsx.length ? undefined
          : <div className="Data-row">
              <div>Technologies</div>
              <div>
                <ul>
                  {technologiesJsx}
                </ul>
              </div>
            </div>}
      </div>
    </div>;
  }
}

export default observer(FunctionalCapabilityDetail);
