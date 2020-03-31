import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import {
  Button, Wrapper,
  Menu, MenuItem,
} from 'react-aria-menubutton';
import userStore from '../../stores/userStore';

class UserWidget extends React.Component {
  componentDidMount() {
    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection() {
    window.location.href = '/logout';
  }

  render() {
    if (!userStore.data.displayName) {
      return <div></div>;
    }
    return <div>
      <Wrapper className="AriaMenuButton" onSelection={this.handleSelection}>
        <Button tag="button" className="AriaMenuButton-trigger">
          {userStore.data.displayName}
        </Button>
        <Menu>
          <ul className="AriaMenuButton-menu">
            <li className="AriaMenuButton-menuItemWrapper">
              <MenuItem value="logout" className="AriaMenuButton-menuItem">
                Logout
              </MenuItem>
            </li>
          </ul>
        </Menu>
      </Wrapper>
    </div>;
  }
}

export default observer(UserWidget);
