import React from 'react'; // eslint-disable-line no-unused-vars
import { EditFieldFk } from 'react-auto-edit';
import ReactTooltip from 'react-tooltip';
import { observer } from 'mobx-react';

const HermeticMetricField = ({
  fieldName, container, readonly, controller, isRequired,
}) => {
  const metricContainer = controller.getLookupItemContainer(container, fieldName);
  let metricTip;
  if (metricContainer) {
    const metricDescription = metricContainer.getItemFieldValue('description');
    if (metricDescription) {
      metricTip = <React.Fragment>
        <ReactTooltip />
        <div className="Ed-field-info"
          data-tip={metricDescription} />
      </React.Fragment>;
    }
  }
  const base = <EditFieldFk fieldName={fieldName}
    container={container} controller={controller}
    readonly={readonly} isRequired={isRequired}
    />;
  return <React.Fragment>
    {base}
    {metricTip}
  </React.Fragment>;
};

export default observer(HermeticMetricField);
