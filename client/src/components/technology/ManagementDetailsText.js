import React from 'react'; // eslint-disable-line no-unused-vars

export default ({ technology }) => {
  const browserCompatibilityJsx = technology.browserCompatibility
    .map(bc => <tr key={bc.browserId}>
        <td>{bc.browserName}</td>
        <td>{bc.compatible}</td>
      </tr>);

  return <div className="Left-col">
    <div className="Head-1">{technology.name}</div>
      <div className="Data-row">
        <div>Comms Responsibility</div>
        <div>{technology.commsResponsibility}</div>
      </div>
      <div className="Data-row">
        <div>Integration Responsibility</div>
        <div>{technology.integrationResponsibility}</div>
      </div>
      <div className="Data-row">
        <div>Licensing Responsibility</div>
        <div>{technology.licensingResponsibility}</div>
      </div>
      <div className="Data-row">
        <div>Report Writing</div>
        <div>{technology.reportWriting}</div>
      </div>
      <div className="Data-row">
        <div>User Access Control</div>
        <div>{technology.userAccessControl}</div>
      </div>
      <div className="Data-row">
        <div>Training Delivery</div>
        <div>{technology.trainingDelivery}</div>
      </div>
      <div className="Data-row">
        <div>Application Help</div>
        <div>{technology.applicationHelp}</div>
      </div>
      <div className="Data-row">
        <div>Incidents and problems</div>
        <div>{technology.incidentsAndProblems}</div>
      </div>
      <div className="Data-row">
        <div>Internal Hosting</div>
        <div>{technology.internalHosting}</div>
      </div>
      <div className="Data-row">
        <div>SME</div>
        <div>{technology.sME}</div>
      </div>
      <div className="Data-row">
        <div>Enhancements</div>
        <div>{technology.enhancements}</div>
      </div>
      <div className="Data-row">
        <div>Upgrade Decisions</div>
        <div>{technology.upgradeDecisions}</div>
      </div>
      <div className="Data-row">
        <div>Upgrade Funding Source</div>
        <div>{technology.upgradeFundingSource}</div>
      </div>
      <div className="Data-row">
        <div>Upgrade Implementation</div>
        <div>{technology.upgradeImplementation}</div>
      </div>
      { !browserCompatibilityJsx.length ? undefined
        : <div className="Data-row">
              <div>Browser Compatibility</div>
              <div>
                <table>
                  <thead><tr><th>Browser</th><th>Compatibility</th></tr></thead>
                  <tbody>
                    {browserCompatibilityJsx}
                  </tbody>
                </table>
              </div>
            </div>}
      <div className="Data-row">
        <div>Web Address</div>
        <div>{technology.webAddress}</div>
      </div>
      <div className="Data-row">
        <div>Comments</div>
        <div>{technology.comments}</div>
      </div>
  </div>;
};
