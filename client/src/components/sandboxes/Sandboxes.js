import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import userStore from '../../stores/userStore';

const sandboxesComponent = () => {
  const sandboxItems = [{ id: null, displayName: 'None - live data' }];
  sandboxItems.push(...userStore.sandboxes
    .map(sb => ({ id: sb, displayName: sb })));
  const sandboxes = sandboxItems.map((sb, index) => {
    let className = 'sandbox';
    if (userStore.sandboxOptions.selected === sb.id) {
      className = `${className} selected`;
    }
    return <div className={className} key={index}
      onClick={() => userStore.selectSandbox(sb.id)}
      >{sb.displayName}</div>;
  });
  return <div className="Single-col-wrapper ">
    <div className="Head-1">Sandboxes</div>
    {sandboxes}
  </div>;
};

export default observer(sandboxesComponent);
