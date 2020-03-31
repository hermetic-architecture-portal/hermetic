import React from 'react'; // eslint-disable-line no-unused-vars
import { EditFieldRestrictedValues } from 'react-auto-edit';
import { observer } from 'mobx-react';

const HermeticScoreField = ({
  fieldName, container, readonly, controller,
}) => {
  const metricContainer = controller.getLookupItemContainer(container, 'metricId');
  const values = [];
  if (metricContainer) {
    const maxScore = metricContainer.getItemFieldValue('maxScore');
    const minScore = metricContainer.getItemFieldValue('minScore');
    for (let i = minScore; i <= maxScore; i += 1) {
      values.push(i);
    }
  }
  const base = <EditFieldRestrictedValues fieldName={fieldName}
    container={container} readonly={readonly}
    suggestedValues={values} isRequired={true}
    />;
  return <React.Fragment>
    {base}
  </React.Fragment>;
};

export default observer(HermeticScoreField);
