import React from 'react'; // eslint-disable-line no-unused-vars

export default ({ baseClassName }) => <div>
  <div>Technology Type:</div>
  <div className={`${baseClassName} TechnologyType-Client-server`}>Client/server</div>
  <div className={`${baseClassName} TechnologyType-SaaS`}>SaaS (Cloud)</div>
  <div className={`${baseClassName} TechnologyType-Serveronly`}>Server only</div>
  <div className={`${baseClassName} TechnologyType-Supportservice`}>Support service</div>
  <div className={`${baseClassName} TechnologyType-Platform`}>Platform</div>
  <div className={`${baseClassName} TechnologyType-Unknown`}>Unknown</div>
</div>;
