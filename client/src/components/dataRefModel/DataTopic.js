import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import DataRefModelEntity from './DataRefModelEntity';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';

const DataTopic = ({ topic }) => {
  const entities = modelStore.dataEntities
    .filter(de => (de.dataTopicId === topic.dataTopicId)
      && !de.parentDataEntityId)
    .map(de => <DataRefModelEntity dataEntity={de} key={de.dataEntityId}/>);
  return <div className="DRM-topic">
    <div>
      <SectionToggleWidget sectionName={topic.dataTopicId}
        sectionType="dataTopic" hasChildren={!!entities.length} />
      {topic.name}
    </div>
    <SectionVisibilityWrapper sectionName={topic.dataTopicId}
      sectionType="dataTopic">
      {entities}
    </SectionVisibilityWrapper>
  </div>;
};

export default observer(DataTopic);
