import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import uuid from 'uuid/v4';
import modelStore from '../../stores/modelStore';

class CompareTechAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.valueChanged = this.valueChanged.bind(this);
    this.addTechnology = this.addTechnology.bind(this);
  }

  componentDidMount() {
    modelStore.loadTechnologies();
  }

  valueChanged(event) {
    // eslint-disable-next-line prefer-destructuring
    const value = event.target.value;
    const technology = modelStore.technologies
      .find(t => t.name === value);
    const id = technology && technology.technologyId;
    this.setState({
      value,
      id,
    });
  }

  addTechnology() {
    if (this.state.id) {
      this.props.compareTechnologiesStore.addTechnology(this.state.id);
      this.setState({
        value: '',
        id: null,
      });
    }
  }

  render() {
    const listId = uuid();
    const options = modelStore.technologies
      .map(t => <option key={t.technologyId}>{t.name}</option>);
    return <div className="Compare-tech-column Compare-tech-add-column">
      <div>
        <input list={listId} autoComplete="off"
          value={this.state.value}
          placeholder="Add technology..."
          onChange={this.valueChanged}
          onKeyPress={(event) => { if (event.key === 'Enter') this.addTechnology(); }} />
        <datalist id={listId}>
          {options}
        </datalist>
        <input type="button" value="+"
          disabled={!this.state.id}
          onClick={this.addTechnology}
          />
      </div>
      <div></div>
    </div>;
  }
}

export default observer(CompareTechAdd);
