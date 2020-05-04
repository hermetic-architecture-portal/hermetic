import React from 'react'; // eslint-disable-line no-unused-vars
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { observer } from 'mobx-react';
import costModelFilterStore from '../../stores/costModelFilterStore';

const DisplaySlider = () => <div className="Overlay-option-group">
  <div className="Group-name">Display</div>
  <div className="Group-options">
    Highest cost
    <div className="Range-selector">
      <Slider value={costModelFilterStore.topItem}
        onChange={(value) => { costModelFilterStore.topItem = value; }} />
    </div>
    Lowest cost
  </div>
</div>;

export default observer(DisplaySlider);
