import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import SectionToggleWidget from '../shared/SectionToggleWidget';
import SectionVisibilityWrapper from '../shared/SectionVisibilityWrapper';
import DataTopic from './DataTopic';

const DataTopicType = ({ topicType }) => {
  const topics = modelStore.dataTopics
    .filter(t => t.dataTopicTypeId === topicType.dataTopicTypeId)
    .map(t => <DataTopic topic={t} key={t.dataTopicId}/>);
  return <div className="DRM-type">
    <div className="Head-1">
      <SectionToggleWidget sectionName={topicType.dataTopicTypeId}
        sectionType="TopicType" hasChildren={!!topics.length}/>
      {topicType.name}
    </div>
    <SectionVisibilityWrapper sectionName={topicType.dataTopicTypeId} sectionType="TopicType">
      {topics}
    </SectionVisibilityWrapper>
  </div>;
};

export default observer(DataTopicType);
