import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { observable } from 'mobx';

/**
 * @typedef {import('../HermeticEditController').default} HermeticEditController
 * @typedef {object} Props
 * @prop {HermeticEditController} controller
 *
 * @extends {React.Component<Props>}
 */
class HermeticEdit extends React.Component {
  constructor(props) {
    super(props);
    this.newSandbox = observable({
      name: 'New',
    });
    this.deleteSandbox = this.deleteSandbox.bind(this);
  }

  deleteSandbox(sandbox) {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure you want to delete sandbox "${sandbox}"`)) {
      this.props.controller.deleteSandbox(sandbox);
    }
  }

  componentDidMount() {
    this.props.controller.loadSandboxes();
  }

  render() {
    if (!this.props.controller.sandboxState.ready) {
      return <div>Loading...</div>;
    }
    if (this.props.controller.sandboxState.liveEditing) {
      return <div className="Edit-hint">
        <p>
          You are editing live data - any changes you save
          will be seen by other users.
        </p>
      </div>;
    }
    const sandboxes = this.props.controller.sandboxState.sandboxes
      .map((sb, index) => {
        const selected = this.props.controller.sandboxState.selectedSandbox === sb.sandbox;
        const className = selected ? 'Ed-button selected' : 'Ed-button';
        const publish = !sb.isGit ? undefined
          : <div className="Ed-button"
          onClick={() => { this.props.controller.publishSandbox(sb.sandbox); }}>Publish</div>;
        return <div className="sandbox" key={index}>
          {sb.sandbox}
          <div className={className}
            onClick={() => { this.props.controller.setSelectedSandbox(sb.sandbox); }}
          >Select</div>
          <div className="Ed-button"
            onClick={() => { this.deleteSandbox(sb.sandbox); }}
          >Delete</div>
          {publish}
        </div>;
      });
    const noSandboxClassName = this.props.controller.sandboxState.selectedSandbox ? 'Ed-button'
      : 'Ed-button selected';
    sandboxes.unshift(<div className="sandbox" key={-1}>
      None - live data
      <div className={noSandboxClassName}
        onClick={() => { this.props.controller.setSelectedSandbox(); }}
      >Select</div>
    </div>);
    return <div className="Hermetic-edit-sandboxes">
      <div>
        <input type="text" value={this.newSandbox.name}
          onChange={(event) => { this.newSandbox.name = event.target.value; }} />
        <div className="Ed-button"
          onClick={() => { this.props.controller.addSandbox(this.newSandbox.name); }}
        >Add</div>
      </div>
      {sandboxes}
    </div>;
  }
}

export default observer(HermeticEdit);
