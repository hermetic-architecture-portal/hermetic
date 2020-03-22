import React from 'react'; // eslint-disable-line no-unused-vars
import { UIFactory } from 'react-auto-edit';
import HermeticScoreField from './components/HermeticScoreField';
import HermeticMetricField from './components/HermeticMetricField';

class HermeticUIFactory extends UIFactory {
  createEditField(options) {
    if (options.collectionSchemaPath.endsWith('.assessments')
      && options.fieldName === 'score') {
      return <HermeticScoreField container={options.container}
        readonly={options.readonly}
        fieldName={options.fieldName} controller={options.controller} />;
    }
    if (options.collectionSchemaPath.endsWith('.assessments')
      && options.fieldName === 'metricId') {
      return <HermeticMetricField container={options.container}
        readonly={options.readonly} isRequired={options.isRequired}
        fieldName={options.fieldName} controller={options.controller} />;
    }
    return super.createEditField(options);
  }
}

export default HermeticUIFactory;
