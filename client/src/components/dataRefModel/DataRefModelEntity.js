import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import modelStore from '../../stores/modelStore';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';

const DataRefModelEntity = ({ dataEntity }) => {
  const children = modelStore.dataEntities
    .filter(e => e.parentDataEntityId === dataEntity.dataEntityId)
    .map(e => <DataRefModelEntity dataEntity={e}
      key={e.dataEntityId}/>);
  return <div className="DRM-entity-wrapper">
    <SectionToggleWidget sectionName={dataEntity.dataEntityId}
      sectionType="dataEntityChildren" hasChildren={!!children.length}/>
    <Link
      to={`/entity/${dataEntity.dataEntityId}`}>
      <div className="DRM-entity">
        {dataEntity.name}
      </div>
    </Link>
    <SectionVisibilityWrapper sectionName={dataEntity.dataEntityId}
      sectionType="dataEntityChildren">
    <div className="DRM-children">
      {children}
    </div>
    </SectionVisibilityWrapper>
  </div>;
};

export default observer(DataRefModelEntity);
