import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import TechnologyHealthDiagram from './TechnologyHealthDiagram';
import HealthLegend from '../shared/HealthLegend';
import modelStore from '../../stores/modelStore';

class TechnologyHealthSummary extends React.Component {
  componentDidMount() {
    modelStore.loadTechnologyHealthMetricTotals();
  }

  render() {
    const totals = modelStore.technologyHealthMetricTotals
      .filter(t => t.userApplication);
    return <div>
      <div className="Health-summary-legend">
        <HealthLegend bands={modelStore.technologyHealthMetricTotalBands} title="Bubble colour"/>
        <div>
          <div>Bubble size:</div>
          <div>SLA Level</div>
        </div>
      </div>
      <TechnologyHealthDiagram
        technologies={totals}
        key={totals}
        />
    </div>;
  }
}

export default observer(TechnologyHealthSummary);
