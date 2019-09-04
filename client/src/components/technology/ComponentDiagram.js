import React from 'react'; // eslint-disable-line no-unused-vars
import cytoscape from 'cytoscape';
import { boundingBoxesIntersect } from 'cytoscape/src/math';
import dagre from 'cytoscape-dagre';
import Swal from 'sweetalert2';
import GraphContainer from '../shared/GraphContainer';
import SaveGraphButton from '../shared/SaveGraphButton';

cytoscape.use(dagre);

const getInterfaceShortName = conn => conn.toInterfaceId.replace(`${conn.toComponentId}.`, '');

const getInterfaceFullId = conn => `${conn.toComponentId}${conn.toInterfaceId ? `.${conn.toInterfaceId}` : ''}`;

const getNormalEdgeId = conn => `${conn.fromComponentId}-${getInterfaceFullId(conn)}`;

const getInterfaceEdgeId = conn => `${conn.toComponentId}-${getInterfaceFullId(conn)}`;

const getVector = (a, b) => ({
  x: b.x - a.x,
  y: b.y - a.y,
});

const getlength = vector => Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));

const normaliseVector = vector => ({
  x: vector.x / getlength(vector),
  y: vector.y / getlength(vector),
});

const multiplyVector = (vector, factor) => ({
  x: vector.x * factor,
  y: vector.y * factor,
});

const hasOverlap = (cy, boundingBox, id) => cy.nodes()
  .some(other => other.data() && (other.data().id !== id)
  && boundingBoxesIntersect(boundingBox, other.boundingBox()));

const getAllTags = (connections) => {
  const tags = [];
  connections.forEach((conn) => {
    (conn.tags || []).forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
  });
  return ['Untagged'].concat(tags
    .sort((a, b) => a.localeCompare(b)));
};

class ComponentDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: getAllTags(this.props.connections),
    };
    this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
    this.compressInterfaces = this.compressInterfaces.bind(this);
    this.tagClicked = this.tagClicked.bind(this);
  }

  tagClicked(tag, ctrlKey) {
    let newSelectedTags;
    const tagSelected = this.state.selectedTags.find(t => t === tag);
    if (ctrlKey) {
      if (tagSelected) {
        newSelectedTags = this.state.selectedTags
          .filter(t => t !== tag);
      } else {
        newSelectedTags = this.state.selectedTags.slice()
          .concat(tag);
      }
    } else {
      newSelectedTags = [tag];
    }
    this.setState({
      selectedTags: newSelectedTags,
    });
    if (this.state.cy) {
      this.state.cy.destroy();
      this.setState({
        cy: null,
      });
      // need to pass in the selected tags
      // as state is not updated in time
      // because they cytoscape element is not react aware
      this.renderCytoscapeElement(newSelectedTags);
    }
  }

  compressInterfaces(cy) {
    const interfaceNodes = cy.nodes('[type = "interface"]');
    interfaceNodes.forEach((i) => {
      const joiningEdgeId = getInterfaceEdgeId({
        toComponentId: i.data().componentId,
        toInterfaceId: i.data().interfaceId,
      });
      const edge = cy.getElementById(joiningEdgeId);
      const initialVector = getVector(edge.sourceEndpoint(), edge.targetEndpoint());
      const intialLength = getlength(initialVector);
      const idealLength = 10;
      const incrementLength = 5;

      if (intialLength > idealLength) {
        const normalisedVector = normaliseVector(initialVector);
        const idealShift = multiplyVector(normalisedVector,
          intialLength - idealLength);
        // try moving the interface node where we ideally want it to be
        // then move it back towards the initial pos if it isn't working
        let shiftedLength = intialLength - idealLength;
        i.shift(idealShift);
        while (hasOverlap(cy, i.boundingBox(), i.data().id)
          && shiftedLength > 0) {
          const incrementShift = multiplyVector(normalisedVector,
            -1 * incrementLength);
          i.shift(incrementShift);
          shiftedLength -= incrementLength;
        }
      }
    });
  }

  renderCytoscapeElement(selectedTags) {
    const { components, connections, technology } = this.props;

    if (!components.length) {
      return;
    }

    const filteredConnections = connections
      .filter(conn => selectedTags
        .some(selectedTag => (
          conn.tags.includes(selectedTag)
          || ((selectedTag === 'Untagged') && !conn.tags.length)
        )));

    const nodes = [];
    const edges = [];

    components
      .filter(comp => filteredConnections
        .some(conn => (conn.fromComponentId === comp.componentId)
          || (conn.toComponentId === comp.componentId)))
      .forEach((c) => {
        const partOfTechnology = c.technologies && c.technologies
          .find(t => t.technologyId === technology.technologyId);

        const componentNode = {
          data: {
            id: c.componentId,
            name: c.name || c.componentId,
            // eslint-disable-next-line no-nested-ternary
            type: c.actor ? 'actor' : (partOfTechnology ? 'component' : 'component external'),
          },
        };
        nodes.push(componentNode);
      });

    filteredConnections.forEach((c) => {
      if (c.toInterfaceId) {
        edges.push({
          data: {
            id: getNormalEdgeId(c),
            description: c.description,
            source: c.fromComponentId,
            target: getInterfaceFullId(c),
            type: 'normal',
          },
        });
        if (!nodes.find(n => n.id === getInterfaceFullId(c))) {
          nodes.push({
            data: {
              id: getInterfaceFullId(c),
              interfaceId: c.toInterfaceId,
              componentId: c.toComponentId,
              type: 'interface',
              name: getInterfaceShortName(c),
            },
          });
          edges.push({
            data: {
              id: getInterfaceEdgeId(c),
              target: c.toComponentId,
              source: getInterfaceFullId(c),
              type: 'interface',
            },
          });
        }
      } else {
        edges.push({
          data: {
            id: getNormalEdgeId(c),
            description: c.description,
            source: c.fromComponentId,
            target: c.toComponentId,
            targetInterface: c.toInterfaceId,
            type: 'normal',
          },
        });
      }
    });

    // alternate interface labels left and right so they fit better
    components.forEach((c) => {
      let alternate = false;
      (c.interfaces || []).forEach((i) => {
        const interfaceNode = nodes
          .find(n => (n.data.interfaceId === i.interfaceId)
            && (n.data.componentId === c.componentId));
        if (interfaceNode) {
          if (alternate) {
            interfaceNode.classes = ['right'];
          }
          alternate = !alternate;
        }
      });
    });

    const cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,
      style: cytoscape.stylesheet()
        .selector('edge')
        .css({
          'curve-style': 'bezier',
          width: '1px',
          'line-color': 'black',
          'text-background-opacity': 1,
          'text-background-color': 'white',
        })
        .selector('edge[type = "normal"]')
        .css({
          'target-arrow-shape': 'triangle',
          'target-arrow-color': 'black',
        })
        .selector('edge[description]')
        .css({
          label: 'data(description)',
          'edge-text-rotation': 'autorotate',
        })
        .selector('node[type ^= "component"]')
        .css({
          content: 'data(name)',
          shape: 'rectangle',
          padding: '8px',
          width: 'label',
          height: '30px',
          'background-color': 'white',
          'text-valign': 'center',
          color: 'black',
          'border-style': 'solid',
          'border-color': 'black',
          'border-width': '1px',
        })
        .selector('node[type = "actor"]')
        .css({
          content: 'data(name)',
          'background-image': '/img/user.png',
          shape: 'rectangle',
          padding: '8px',
          'background-color': 'white',
          'background-fit': 'contain',
          'text-valign': 'bottom',
          'text-wrap': 'wrap',
          color: 'black',
          'text-margin-y': '5px',
          'text-background-opacity': 1,
          'text-background-color': 'white',
        })
        .selector('node[type = "component external"]')
        .css({
          'border-style': 'dashed',
        })
        .selector('node[type = "interface"]')
        .css({
          content: 'data(name)',
          shape: 'circle',
          width: '7px',
          height: '7px',
          'border-style': 'solid',
          'border-color': 'black',
          'border-width': '1px',
          'background-color': 'white',
          'text-valign': 'center',
          'text-halign': 'left',
          'text-margin-x': '-6px',
          'text-background-opacity': 1,
          'text-background-color': 'white',
        })
        .selector('.right')
        .css({
          'text-margin-x': '6px',
          'text-halign': 'right',
        }),
      elements: {
        nodes,
        edges,
      },
    });

    const layoutConfig = {
      name: 'dagre',
      nodeDimensionsIncludeLabels: true,
      minLen: (edge) => {
        const data = edge.data();
        if (data && data.description && data.description.length) {
          return 1 + Math.floor(data.description.length / 6);
        }
        return 1;
      },
    };

    cy.on('tap', 'node', (event) => {
      const data = event.target.data();
      const componentId = data.componentId || data.id;
      const component = components.find(c => c.componentId === componentId);
      let message;
      if (data.type === 'interface') {
        const componentInterface = component.interfaces
          .find(i => i.interfaceId === data.interfaceId);
        message = `<div class='Head-3'>${componentInterface.interfaceId}</div>
          <div>${componentInterface.description || ''}</div>`;
      } else {
        message = `<div class='Head-3'>${component.componentId}</div>
          <div>${component.description || ''}</div>`;
      }
      Swal.fire({
        html: message,
      });
    });

    // standard layout puts the interfaces visually too far from the components
    // so tidy this up after
    cy.one('layoutstop', () => this.compressInterfaces(cy));

    cy.layout(layoutConfig).run();

    this.setState({ cy });
  }

  componentDidMount() {
    this.renderCytoscapeElement(this.state.selectedTags);
  }

  render() {
    const { technology, components, connections } = this.props;

    let filter;

    if (connections.some(conn => conn.tags && conn.tags.length)) {
      const tags = getAllTags(connections);
      const tagOptions = tags.map((tag) => {
        let className = 'Component-tag';
        if (this.state.selectedTags.find(t => t === tag)) {
          className = `${className} selected`;
        }
        return <div
          key={tag}
          onClick={event => this.tagClicked(tag, event.ctrlKey)}
          className={className}>
            {tag}
          </div>;
      });
      filter = <div className="Component-filter-area">Tags: {tagOptions}</div>;
    }

    return <div>
        <div className="Head-1">
          {technology.name}
          <SaveGraphButton cy={this.state.cy} filename={`TechnologyComponents${technology.technologyId}`}/>
        </div>
        {filter}
        {!components.length
          ? <div>None recorded</div>
          : <GraphContainer topMargin={180} cy={this.state.cy}/>
        }
    </div>;
  }
}

export default ComponentDiagram;
