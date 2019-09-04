import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import loadingStore from '../../stores/loadingStore';

const loading = () => {
  if (loadingStore.inFlightItems.length > 0) {
    return <div className="lds-dual-ring"></div>;
  }
  return null;
};

export default observer(loading);
