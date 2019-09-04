import React from 'react'; // eslint-disable-line no-unused-vars
import cytoscape from 'cytoscape';
import spread from 'cytoscape-spread';
import { withRouter } from 'react-router-dom';
import GraphContainer from '../shared/GraphContainer';
import SaveGraphButton from '../shared/SaveGraphButton';

spread(cytoscape);

const selectColour = (healthScore) => {
  switch (healthScore) {
    case 1:
      return 'red';
    case 2:
      return 'orange';
    case 3:
      return 'yellow';
    case 4:
      return 'lightgreen';
    default:
      return 'gray';
  }
};

class TechnologyHealthDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
  }

  renderCytoscapeElement() {
    const { technologies } = this.props;
    let maxSlaLevel = technologies.reduce((previous, current) => {
      if (current.slaLevel > previous) {
        return current.slaLevel;
      }
      return previous;
    }, 0);

    if (technologies.some(t => typeof t.slaLevel === 'undefined')) {
      maxSlaLevel += 1;
    }

    const nodes = technologies.map((a) => {
      const slaLevel = (typeof a.slaLevel !== 'undefined') ? a.slaLevel
        : maxSlaLevel;

      const size = 15 * (1 + maxSlaLevel - slaLevel);
      return {
        data: {
          id: a.technologyId,
          name: a.technologyName,
          size,
          colour: selectColour(a.band.levelNumber),
        },
      };
    });

    const cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,
      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          label: 'data(name)',
          height: 'data(size)',
          width: 'data(size)',
          'background-color': 'data(colour)',
          'border-style': 'solid',
          'border-width': '1px',
          'border-color': 'lightgray',
          'text-margin-y': '-10px',
        }),
      elements: {
        nodes,
      },
      layout: {
        name: 'spread',
        animate: false,
        prelayout: {
          name: 'random',
        },
      },
    });
    cy.on('tap', 'node', event => this.props
      .history.push(`/technology/${event.target.id()}/health`));
    this.setState({ cy });
  }

  componentWillUnmount() {
    if (this.state.cy) {
      this.state.cy.destroy();
    }
  }

  componentDidMount() {
    this.renderCytoscapeElement();
  }

  render() {
    // note staticSize - this cytoscape layout type does not cope with dynamic resize
    return <div className="Single-col-wrapper">
      <div className="Head-1">
        Technology Health Summary
        <SaveGraphButton cy={this.state.cy} filename='HealthSummary'/>
      </div>
      <GraphContainer topMargin={260} cy={this.state.cy} staticSize={true}/>
    </div>;
  }
}

export default withRouter(TechnologyHealthDiagram);
