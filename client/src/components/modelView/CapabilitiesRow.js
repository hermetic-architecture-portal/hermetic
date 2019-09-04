import React from 'react'; // eslint-disable-line no-unused-vars
import Capability from './Capability';

export default ({ cols, otherCapabilities, capabilityOverlayStore }) => {
  const result = [];
  let i = 0;
  while (i < cols.length) {
    const { capability } = cols[i];
    if (!capability) {
      result.push(<div className="Capability-column Blank" key={i}/>);
      i += 1;
    } else {
      let colSpan = 1;
      for (let j = i + 1; j < cols.length; j += 1) {
        if (cols[j].capability === capability) {
          colSpan += 1;
        } else {
          break;
        }
      }
      result.push(<div key={i} className={`Capability-column Span-${colSpan} Capability`}>
        <Capability capability={capability} level={1} capabilities={otherCapabilities}
          capabilityOverlayStore={capabilityOverlayStore}/>
      </div>);
      i += colSpan;
    }
  }
  return <div className="Capability-row">{result}</div>;
};
