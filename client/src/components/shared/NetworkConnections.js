import React from 'react'; // eslint-disable-line no-unused-vars
import cytoscape from 'cytoscape';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import dagre from 'cytoscape-dagre';
// import klay from 'cytoscape-klay';
// import cola from 'cytoscape-cola';
// import coseBilkent from 'cytoscape-cose-bilkent';
import GraphContainer from './GraphContainer';
import SaveGraphButton from './SaveGraphButton';

// leaving code for unused layout options here intentionally
// breadthfirst does not cope with nested components
// klay has too many edge crossings
// cose doesn't do anything useful for this case
// cose-bilkent is pretty good, not fantastic on edge crossings
// cola doesn't do anything useful for this case

const layout = 'dagre';

let layoutConfig;

if (layout === 'klay') {
  // cytoscape.use(klay);
  layoutConfig = {
    name: 'klay',
    nodeDimensionsIncludeLabels: true,
    klay: {
      spacing: 40,
    },
    // minLen: () => 2,
  };
} else if (layout === 'dagre') {
  cytoscape.use(dagre);
  layoutConfig = {
    name: 'dagre',
    nodeDimensionsIncludeLabels: true,
    minLen: (edge) => {
      const data = edge.data();
      if (data && data.label && data.label.length) {
        return 2;
      }
      return 1;
    },
  };
} else if (layout === 'cose') {
  layoutConfig = {
    name: 'cose',
    nodeDimensionsIncludeLabels: true,
  };
} else if (layout === 'cose-bilkent') {
  // cytoscape.use(coseBilkent);
  layoutConfig = {
    name: 'cose-bilkent',
    nodeDimensionsIncludeLabels: true,
    animate: false,
    idealEdgeLength: 120,
  };
} else if (layout === 'cola') {
  // cytoscape.use(cola);
  layoutConfig = {
    name: 'cola',
    nodeDimensionsIncludeLabels: true,
    // animate: false,
  };
}

// network diagram images are free to use, from
// https://github.com/ecceman/affinity
// converted to PNG as cytoscape did not
// like them as SVG

const getEdgeLabel = (conn) => {
  const result = [];
  if (conn.protocol && conn.port) {
    result.push(`${conn.protocol}:${conn.port}`);
  }
  if (conn.summary) {
    result.push(conn.summary);
  }
  return result.join('\n');
};

class NetworkConnections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
  }

  renderCytoscapeElement() {
    const {
      connections,
      nodes,
      networkLocations,
      environmentId,
    } = this.props;

    if (!(nodes.length && connections.length)) {
      return;
    }

    const cyNodes = [];

    if (environmentId === 'default') {
      cyNodes.push(...nodes.map(dataNode => ({
        data: {
          id: dataNode.nodeId,
          nodeId: dataNode.nodeId,
          name: dataNode.name,
          type: dataNode.nodeType,
          isCore: dataNode.isCore,
          parent: dataNode.locationId,
        },
      })));
    } else {
      nodes.forEach((dataNode) => {
        const envNodes = dataNode.environmentNodes
          .filter(en => en.environmentId === environmentId);
        if (envNodes.length === 0) {
          // no environment specific nodes for the env
          // so just show the generic node
          cyNodes.push({
            data: {
              id: dataNode.nodeId,
              nodeId: dataNode.nodeId,
              name: dataNode.name,
              type: dataNode.nodeType,
              isCore: dataNode.isCore,
              parent: dataNode.locationId,
            },
          });
        } else {
          cyNodes.push({
            data: {
              id: dataNode.nodeId,
              nodeId: envNodes.length === 1 ? envNodes[0].nodeId : dataNode.nodeId,
              name: envNodes.map(en => en.name).join('\n'),
              type: dataNode.nodeType,
              isCore: dataNode.isCore,
              parent: dataNode.locationId,
            },
          });
        }
      });
    }

    const locationNodes = networkLocations
      .map(l => ({
        data: {
          id: l.locationId,
          name: l.name,
          type: 'location',
        },
      }));

    cyNodes.push(...locationNodes);

    const edges = connections.map(conn => ({
      data: {
        source: conn.from,
        target: conn.to,
        label: getEdgeLabel(conn),
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
          width: '1px',
          'line-color': 'black',
          label: 'data(label)',
          'text-background-opacity': 1,
          'text-background-color': 'white',
          'edge-text-rotation': 'autorotate',
        })
        .selector('node')
        .css({
          content: 'data(name)',
          shape: 'rectangle',
          padding: '8px',
          'background-color': 'white',
          'background-image': '/img/server.png',
          'background-fit': 'contain',
          'text-valign': 'bottom',
          'text-wrap': 'wrap',
          color: 'black',
          'font-weight': 'bold',
          'text-margin-y': '5px',
          'text-background-opacity': 1,
          'text-background-color': 'white',
        })
        .selector('node[?isCore]')
        .css({
          color: 'darkred',
        })
        .selector('node[type = "Database"]')
        .css({
          'background-image': '/img/storage.png',
        })
        .selector('node[type = "Desktop"]')
        .css({
          'background-image': '/img/client.png',
        })
        .selector('node[type = "Mobile Device"]')
        .css({
          'background-image': '/img/tablet.png',
        })
        .selector('node[type = "Cluster"]')
        .css({
          'background-image': '/img/server-cluster.png',
        })
        .selector('node[type ^= "Load Balancer"]')
        .css({
          'background-image': '/img/loadbalancer.png',
        })
        .selector('node[type = "location"]')
        .css({
          'border-style': 'solid',
          'border-color': 'black',
          'background-image': 'none',
        }),
      elements: {
        nodes: cyNodes,
        edges,
      },
      layout: layoutConfig,
    });

    cy.on('tap', 'edge', (event) => {
      const data = event.target.data();
      const conn = connections
        .find(c => (c.from === data.source) && (c.to === data.target));
      Swal.fire({
        html: `<div class='Head-3'>${conn.from} -> ${conn.to}</div>
        <div>Protocol: ${conn.protocol || 'unknown'}</div>
        <div>Port: ${conn.port || 'unknown'}</div>
        <div>${conn.summary || ''}</div>
        <div>${conn.description && (conn.summary !== conn.description) ? conn.description : ''}</div>`,
      });
    });

    cy.on('tap', 'node', (event) => {
      const data = event.target.data();
      if (data.nodeId
        && (data.type !== 'location')
        && (data.type !== 'Desktop')
        && (data.type !== 'Mobile Device')) {
        this.props.history.push(`/server/${data.nodeId}`);
      }
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
    const { connections, identifier, environmentId } = this.props;

    return <div className="Right-col">
      <div className="Head-2">
        Network Connections
        <SaveGraphButton cy={this.state.cy} filename={`NetworkConnections${identifier}-${environmentId}`}/>
      </div>
      {!connections.length
        ? <div>None recorded</div>
        : <GraphContainer topMargin={180} cy={this.state.cy}/>
      }
    </div>;
  }
}

export default withRouter(NetworkConnections);
