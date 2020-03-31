import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Menu } from 'react-auto-edit';

/**
 * @typedef {import('../HermeticEditController').default} HermeticEditController
 * @param {Object} props
 * @param {HermeticEditController} props.controller
 */
const HermeticMenu = ({ controller }) => {
  if (!controller.sandboxState.selectedSandbox) {
    return <div className="Edit-hint">
        <p>
          Data is edited in personal sandboxes that do not interfere with what
          other users see.
        </p>
        <p>
          You must create and select a sandbox before you can edit data.
        </p>
        <p>
          To preview the changes you make in the regular screens
          (e.g. the Business Reference Model),
          you need to save your editing changes and then refresh the regular screen (F5 key)
        </p>
        <p>
          When you are happy with the changes, click the "Publish" button, which will
          submit your changes for peer review
        </p>
    </div>;
  }
  return <Menu controller={controller} title="Entities" />;
};

export default observer(HermeticMenu);
