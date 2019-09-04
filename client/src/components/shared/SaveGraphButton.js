import React from 'react'; // eslint-disable-line no-unused-vars
import { saveAs } from 'file-saver';

class SaveGraphButton extends React.Component {
  constructor() {
    super();
    this.saveGraph = this.saveGraph.bind(this);
  }

  async saveGraph() {
    const blob = await this.props.cy.png({
      output: 'blob-promise',
      full: true,
    });
    saveAs(blob, `${this.props.filename}.png`);
  }

  render() {
    if (!this.props.cy) {
      return <div></div>;
    }
    return <div className="Save" onClick={this.saveGraph}/>;
  }
}

export default SaveGraphButton;
