import React from 'react'; // eslint-disable-line no-unused-vars
import cytoscape from 'cytoscape';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import dagre from 'cytoscape-dagre';
import GraphContainer from '../shared/GraphContainer';
import SaveGraphButton from '../shared/SaveGraphButton';

cytoscape.use(dagre);

class TechnologyConnections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
  }

  renderCytoscapeElement() {
    const { connections, technologies } = this.props;

    if (!connections.length) {
      return;
    }
    const nodes = [];
    connections.forEach((c) => {
      if (!nodes.find(n => n.data.id === c.from)) {
        nodes.push({
          data: {
            id: c.from,
            name: technologies.find(a => a.technologyId === c.from).name,
          },
        });
      }
      if (!nodes.find(n => n.data.id === c.to)) {
        nodes.push({
          data: {
            id: c.to,
            name: technologies.find(a => a.technologyId === c.to).name,
          },
        });
      }
    });

    const edges = connections.map(conn => ({
      data: {
        source: conn.from,
        target: conn.to,
        summary: conn.summary,
        description: conn.description,
      },
    }));

    const cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,
      style: cytoscape.stylesheet()
        .selector('edge')
        .css({
          'target-arrow-shape': 'triangle',
          'target-arrow-color': 'black',
          'curve-style': 'bezier',
          'edge-text-rotation': 'autorotate',
          'text-background-opacity': 1,
          'text-background-color': 'white',
          width: '1px',
          'line-color': 'black',
        })
        .selector('edge[summary]')
        .css({
          label: 'data(summary)',
        })
        .selector('node')
        .css({
          content: 'data(name)',
          shape: 'rectangle',
          padding: '8px',
          width: 'label',
          height: '30px',
          'text-valign': 'center',
          color: 'white',
          'font-weight': 'bold',
        }),
      elements: {
        nodes,
        edges,
      },
      layout: {
        name: 'dagre',
        minLen: () => 3,
      },
    });
    cy.on('tap', 'node', (event) => {
      this.props.history.push(`/technology/${event.target.id()}`);
    });
    cy.on('tap', 'edge', (event) => {
      const data = event.target.data();
      const source = technologies.find(a => a.technologyId === data.source);
      const target = technologies.find(a => a.technologyId === data.target);
      Swal.fire({
        html: `<div class='Head-3'>${source.name} -> ${target.name}</div>
          ${data.description || data.summary || ''}`,
      });
    });
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
    return <div className="Right-col">
      <div className="Head-2">
        Data Connections
        <SaveGraphButton cy={this.state.cy} filename={`DataConnections${this.props.name || ''}`}/>
      </div>
      <div>
        {!this.props.connections.length
          ? <div>None recorded</div>
          : <GraphContainer topMargin={180} cy={this.state.cy} />
        }
      </div>
    </div>;
  }
}

export default withRouter(TechnologyConnections);
