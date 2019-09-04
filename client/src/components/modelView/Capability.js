import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import constants from '../../constants';
import modelStore from '../../stores/modelStore';
import CapabilityTechnology from './CapabilityTechnology';
import CapabilityBusinessUnit from './CapabilityBusinessUnit';
import CapabilityHeadcount from './CapabilityHeadcount';

const getDescendantCapabilities = (capabilities, ourCapabilityId) => {
  const result = [];
  const directDescendants = capabilities
    .filter(cap => cap.parentCapabilityId === ourCapabilityId)
    .map(cap => cap.capabilityId);
  result.push(...directDescendants);
  directDescendants.forEach((dd) => {
    const nextGeneration = getDescendantCapabilities(capabilities, dd);
    result.push(...nextGeneration);
  });
  return result;
};

const Capability = ({
  capability,
  capabilities,
  level,
  capabilityOverlayStore,
}) => {
  const showChildCapabilities = capabilityOverlayStore
    .shouldShowChildCapabilities(capability.capabilityId, level);

  const childCapabilities = capabilities
    .filter(cap => cap.parentCapabilityId === capability.capabilityId);

  let expandControlClassName = 'Capability-expand';
  if (childCapabilities.length) {
    expandControlClassName = `${expandControlClassName} Has-children`;
  }
  if (showChildCapabilities) {
    expandControlClassName = `${expandControlClassName} Expanded`;
  }

  const childCapabilityElements = !showChildCapabilities ? undefined : <div>
    {childCapabilities
      .map(cap => <Capability
        key={cap.capabilityId}
        capability={cap}
        level={level + 1}
        capabilities={capabilities}
        capabilityOverlayStore={capabilityOverlayStore}
    />)}
  </div>;

  let className = `Cap-model-level-${level}`;

  const showHealth = (
    capabilityOverlayStore.overlays.includes(constants.capabilityOverlays.capabilityHealth)
    && modelStore.capabilityHealthMetricTotals.length
  );

  if (showHealth) {
    const health = modelStore.capabilityHealthMetricTotals
      .find(h => h.capabilityId === capability.capabilityId);
    if (health) {
      className = `${className} health-${health.band.levelNumber}-of-${health.maxLevelNumber}`;
    }
  }

  const showTechnologies = capabilityOverlayStore.overlays
    .includes(constants.capabilityOverlays.technologies)
    && modelStore.technologies.length;

  const descendantCapabilities = getDescendantCapabilities(capabilities, capability.capabilityId);

  let technologies;
  if (showTechnologies) {
    let techList = modelStore.technologies
      .filter(tech => tech.capabilities.some(cap => cap.capabilityId === capability.capabilityId));

    if (!showChildCapabilities) {
      // show the child capability technologies on the parent
      const childTechnologies = modelStore.technologies
        .filter(tech => !techList.some(a => a.technologyId === tech.technologyId))
        .filter(tech => tech.capabilities
          && tech.capabilities.some(tc => descendantCapabilities.includes(tc.capabilityId)));
      techList.push(...childTechnologies);
    } else {
      // make sure we don't show capabilities on parent when also shown on child
      techList = techList
        .filter(tech => !tech.capabilities
          .some(tc => descendantCapabilities.includes(tc.capabilityId)));
    }
    technologies = <div className="Capability-technologies">
      {techList.map(tech => <CapabilityTechnology
        key={tech.technologyId} technologyName={tech.name}
        technologyId={tech.technologyId} technologyType={tech.technologyType}
        capabilityOverlayStore={capabilityOverlayStore}
      />)}
    </div>;
  }

  const showBusinessUnits = capabilityOverlayStore.overlays
    .includes(constants.capabilityOverlays.businessUnits)
    && modelStore.businessUnits.length;

  let businessUnits;

  if (showBusinessUnits) {
    let buList = modelStore.businessUnits
      .filter(bu => bu.capabilities.some(cap => cap.capabilityId === capability.capabilityId));

    if (!showChildCapabilities) {
      // show the child business units on the parent
      const childBusinessUnits = modelStore.businessUnits
        .filter(bu => !buList.some(a => a.businessUnitId === bu.businessUnitId))
        .filter(bu => bu.capabilities
          && bu.capabilities.some(buc => descendantCapabilities.includes(buc.capabilityId)));
      buList.push(...childBusinessUnits);
    } else {
      // make sure we don't show capabilities on parent when also shown on child
      buList = buList
        .filter(bu => !bu.capabilities
          .some(buc => descendantCapabilities.includes(buc.capabilityId)));
    }
    businessUnits = <div className="Capability-business-units">
      {buList.map(bu => <CapabilityBusinessUnit
        key={bu.businessUnitId} businessUnitName={bu.name}
        businessUnitId={bu.businessUnitId}
      />)}
    </div>;
  }

  return <div className={className}>
    <CapabilityHeadcount capabilityId={capability.capabilityId}
      capabilityOverlayStore={capabilityOverlayStore} />
    <div className={expandControlClassName}
      onClick={() => capabilityOverlayStore.toggleExpansion(capability.capabilityId, level)}
    ></div>
    <Link to={`/capability/${capability.capabilityId}`}>
      <div className="Cap-model-cap-name">{capability.name}</div>
    </Link>
    {childCapabilityElements}
    {technologies}
    {businessUnits}
  </div>;
};

export default observer(Capability);
