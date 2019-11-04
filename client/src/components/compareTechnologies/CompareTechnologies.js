import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import CompareTechColumn from './CompareTechColumn';
import CompareTechLabelColumn from './CompareTechLabelColumn';
import CompareTechAdd from './CompareTechAdd';
import CompareTechnologiesStore from '../../stores/CompareTechnologiesStore';

class CompareTechnologies extends React.Component {
  constructor(props) {
    super(props);
    this.compareTechnologiesStore = new CompareTechnologiesStore();
  }

  componentDidMount() {
    this.compareTechnologiesStore.loadSelectedTechnologies();
  }

  render() {
    const { technologyIds } = this.compareTechnologiesStore;
    const technologies = (technologyIds || [])
      .map(id => modelStore.technologyDetails.find(td => td.technologyId === id))
      .filter(technology => !!technology);
    if (technologies.length !== (technologyIds || []).length) {
      return null;
    }

    const techDetails = (technologyIds || [])
      .map(id => modelStore.technologyTechDetails.find(td => td.technologyId === id))
      .filter(technology => !!technology);
    const allFunctionalCapabilities = [];
    techDetails.forEach((t) => {
      allFunctionalCapabilities.push(...t.functionalCapabilities
        .filter(c => !allFunctionalCapabilities
          .some(fc => fc.functionalCapabilityId === c.functionalCapabilityId)));
    });
    allFunctionalCapabilities.sort((a, b) => a.name.localeCompare(b.name));

    const technologyHealthAssessments = (technologyIds || [])
      .map(id => modelStore.technologyHealthDetails.find(td => td.technologyId === id))
      .filter(technology => !!technology);
    const allHealthMetrics = [];
    const allHealthMetricsCategories = [];
    technologyHealthAssessments.forEach((th) => {
      allHealthMetrics.push(...(th.metrics || [])
        .filter(m => !allHealthMetrics
          .some(am => am.metricId === m.metricId))
        .map(m => ({
          metricId: m.metricId,
          name: m.name,
          description: m.description,
          category: m.category,
        })));
    });
    allHealthMetrics.forEach((hm) => {
      if (!allHealthMetricsCategories.includes(hm.category)) {
        allHealthMetricsCategories.push(hm.category);
      }
    });

    const columns = (technologyIds || []).map(t => <CompareTechColumn
      key={t}
      technologyId={t}
      allFunctionalCapabilities={allFunctionalCapabilities}
      allHealthMetrics={allHealthMetrics}
      allHealthMetricsCategories={allHealthMetricsCategories}
      compareTechnologiesStore={this.compareTechnologiesStore}
    />);

    return <div className="Single-col-wrapper">
      <div className="Head-1">Compare Technologies</div>
      <div className="Compare-tech-wrapper">
        <CompareTechLabelColumn
          allFunctionalCapabilities={allFunctionalCapabilities}
          allHealthMetrics={allHealthMetrics}
          allHealthMetricsCategories={allHealthMetricsCategories}
          />
        {columns}
        <CompareTechAdd compareTechnologiesStore={this.compareTechnologiesStore} />
      </div>
    </div>;
  }
}

export default observer(CompareTechnologies);
