import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import modelStore from '../../stores/modelStore';
import DataTopicType from './DataTopicType';
import sectionsStore from '../../stores/sectionsStore';

class DataRefModel extends React.Component {
  async componentDidMount() {
    await modelStore.loadDataEntities();
    sectionsStore.hide(
      'dataEntityChildren',
      modelStore.dataEntities.map(e => e.dataEntityId),
    );
  }

  render() {
    const types = modelStore.dataTopicTypes
      .map(t => <DataTopicType
        key={t.dataTopicTypeId}
        topicType={t}
      />);
    return <div>{types}
    </div>;
  }
}

export default observer(DataRefModel);
