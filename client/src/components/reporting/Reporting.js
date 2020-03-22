import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import api from '../../api';

class Reporting extends React.Component {
  constructor(props) {
    super(props);
    this.reportingInfo = observable({
      token: '',
      routes: [],
      tokenExpiry: 0,
    });
  }

  async componentDidMount() {
    const reportingInfo = await api.getReporting();
    if (reportingInfo.token) {
      this.reportingInfo.token = reportingInfo.token;
    }
    this.reportingInfo.tokenExpiryHours = reportingInfo.tokenExpiryHours;
    this.reportingInfo.routes = reportingInfo.routes
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log(this.reportingInfo);
  }

  render() {
    const routes = this.reportingInfo.routes.map((r) => {
      const fullPath = `${window.location.protocol}//${window.location.host}${r.path}`;
      return <div key={r.path} className="Reporting-route">
        <div>{r.name}</div>
        { r.description ? <div>{r.description}</div> : undefined }
        <div>
          <span className="Copy-content">{fullPath}</span>
          <CopyToClipboard text={fullPath}>
            <button className="Copy-button">Copy</button>
          </CopyToClipboard>
        </div>
      </div>;
    });
    const authString = `Bearer ${this.reportingInfo.token}`;
    const tokenExpiry = this.reportingInfo.tokenExpiryHours <= 48
      ? `${this.reportingInfo.tokenExpiryHours} hours`
      : `${Math.floor(this.reportingInfo.tokenExpiryHours / 24)} days`;
    const tokenSection = this.reportingInfo.token ? <React.Fragment>
      <li>Select "Authorization" in the "HTTP request header parameters" dropdown in Excel</li>
      <li>Insert the following security token as the parameter value in Excel: <br></br>
        <span className="Copy-content">{authString}</span><CopyToClipboard text={authString}>
          <button className="Copy-button">Copy</button>
        </CopyToClipboard>
      </li>
      <li>Note: this token will expire in {tokenExpiry} -
        at which point you will need to get a new token here.</li>
    </React.Fragment> : undefined;
    return <div className="Single-col-wrapper">
      <div className="Reporting-instructions">
        <p>Hermetic provides a reporting API suitable for use with Excel PowerQuery,
        PowerBI and other tools.</p>

        <p>To connect from Excel:
          <ol>
            <li>Click Excel's "Data | From Web" menu item</li>
            <li>Select the "Advanced" radio button</li>
            <li>Copy one of the reporting API URLs shown in Hermetic below
              and paste into the "URL Parts" field in Excel</li>
            {tokenSection}
            <li>Click "OK" in Excel</li>
            <li>Once the preview loads in Excel PowerQuery Editor,
              click the "List Tools | Transform | To Table" menu item</li>
            <li>Accept the defaults in the "To Table" popup dialog</li>
            <li>Click "Transform | Structured Column | Expand"</li>
            <li>Choose the columns to include, click "OK"
              and you will have the data ready for use in Excel</li>
          </ol>
        </p>

      </div>
      <div>
        Reporting API URLs:
        <div>
          {routes}
        </div>
      </div>
    </div>;
  }
}

export default observer(Reporting);
