import React from 'react'; // eslint-disable-line no-unused-vars

class GraphContainer extends React.Component {
  componentDidMount() {
    this.setState({ height: window.innerHeight });
    this.windowResized = this.windowResized.bind(this);
    window.addEventListener('resize', this.windowResized);
  }

  windowResized() {
    this.setState({ height: window.innerHeight });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResized);
  }

  render() {
    const { topMargin, cy, staticSize } = this.props;
    const height = staticSize ? window.innerHeight : this.state && this.state.height;
    if ((!staticSize) && cy) {
      cy.one('resize', null, () => {
        cy.fit(null, 10);
      });
    }
    let containerSize;
    if (height) {
      containerSize = {
        height: `${height - topMargin}px`,
      };
    }
    return <div>
      <div className="Graph-container" id="cy" style={containerSize}/>
    </div>;
  }
}

export default GraphContainer;
