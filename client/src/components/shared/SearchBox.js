import React from 'react'; // eslint-disable-line no-unused-vars

class SearchBox extends React.Component {
  constructor() {
    super();
    this.valueChanged = this.valueChanged.bind(this);
  }

  valueChanged(event) {
    this.setState({ searchValue: event.target.value });
    this.props.valueChanged(event.target.value);
  }

  render() {
    return <div className="Search-box">
      <input type="text" placeholder="Search..."
        value={this.state ? this.state.searchValue : undefined}
        onChange={this.valueChanged}/>
    </div>;
  }
}

export default SearchBox;
