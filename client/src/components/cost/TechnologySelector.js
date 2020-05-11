import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import costModelFilterStore from '../../stores/costModelFilterStore';

const TechnologySelector = () => <div className="Overlay-option-group">
  <div className="Group-name">Show</div>
  <div className="Group-options">
    <select value={costModelFilterStore.vendorsOrTechnologies}
      onChange={(event) => { costModelFilterStore.vendorsOrTechnologies = event.target.value; }}
    >
      <option value="vendors">Vendors</option>
      <option value="technologies">Technologies</option>
    </select>
  </div>
</div>;

export default observer(TechnologySelector);
