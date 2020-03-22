import React from 'react'; // eslint-disable-line no-unused-vars
import { Link, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Button, Wrapper,
  Menu, MenuItem,
} from 'react-aria-menubutton';
import { features } from 'hermetic-common';
import UserWidget from './UserWidget';
import userStore from '../../stores/userStore';
import config from '../../config';

const activeClassname = (location, path) => (
  location.pathname === path
    ? 'current'
    : ''
);

const makePath = (locationParts, currentIndex) => (
  locationParts.filter((path, index) => index <= currentIndex)
    .join('/')
);

const makeMenuItem = (item, location, depth) => <li
  className="AriaMenuButton-menuItemWrapper"
  key={item.text}>
    <MenuItem value={item.text} className={`AriaMenuButton-menuItem ${activeClassname(location, item.link)}`}>
    <Link to={item.link}>
      <div className={`Link-depth-${depth}`}>{item.text}</div>
    </Link>
    </MenuItem>
</li>;

const makeMenuItems = (items, location, depth) => {
  const result = [];
  items.forEach((item) => {
    result.push(makeMenuItem(item, location, depth || 0));
    result.push(...makeMenuItems(item.children, location, (depth || 0) + 1));
  });
  return result;
};

const header = ({ location }) => {
  const menuItems = [
    {
      link: config.resolvePathAgainstDefault('/eaRefModel'),
      itemLinkBase: '/eaArtifact',
      text: 'Enterprise Architecture Model',
      children: [],
    },
    {
      link: config.resolvePathAgainstDefault('/businessRefModel'),
      itemLinkBase: '/capability',
      text: 'Business Reference Model',
      children: [],
    },
    {
      link: config.resolvePathAgainstDefault('/dataRefModel'),
      itemLinkBase: '/entity',
      text: 'Data Reference Model',
      children: [],
    },
  ];

  if (userStore.data.allowedFeatures.includes(features.techDetails)) {
    menuItems.push({
      link: config.resolvePathAgainstDefault('/techRefModel'),
      text: 'Technical Reference Model',
      children: [],
    });
  }

  menuItems.push(...[
    {
      link: '/technologies',
      itemLinkBase: '/technology',
      text: 'Technology List',
      children: [],
    },
    {
      link: '/businessUnits',
      itemLinkBase: '/businessUnit',
      text: 'Business Unit List',
      children: [],
    },
  ]);

  if (userStore.data.allowedFeatures.includes(features.technologyHealthMetrics)) {
    menuItems.push({
      link: '/technologyHealthSummary',
      text: 'Technology Health Summary',
      children: [],
    });
  }

  if (userStore.data.allowedFeatures.includes(features.techDetails)) {
    menuItems.push({
      link: '/servers',
      itemLinkBase: '/server',
      text: 'Server List',
      children: [],
    });
  }

  if (userStore.data.allowedFeatures.includes(features.techDetails)) {
    menuItems.push({
      link: '/functionalCapabilities',
      itemLinkBase: '/functionalCapability',
      text: 'Functional Capabilities',
      children: [],
    });
  }

  menuItems.push({
    link: '/compareTechnologies',
    itemLinkBase: '/compareTechnologies',
    text: 'Compare Technologies',
    children: [],
  });

  if (userStore.data.allowedFeatures.includes(features.reporting)) {
    menuItems.push({
      link: '/reporting',
      text: 'Reporting',
      children: [],
    });
  }

  if (userStore.data.allowedFeatures.includes(features.edit)) {
    menuItems.push({
      link: '/edit',
      text: 'Edit',
      children: [],
    });
  }

  // Add breadcrumbs
  const locationParts = location.pathname.split('/');
  if (locationParts.length >= 3) {
    let parentMenuItem = menuItems.find(i => i.itemLinkBase === makePath(locationParts, 1));
    if (parentMenuItem) {
      for (let i = 2; i < locationParts.length; i += 1) {
        const childMenuItem = {
          link: makePath(locationParts, i),
          text: locationParts[i],
          children: [],
        };
        parentMenuItem.children.push(childMenuItem);
        parentMenuItem = childMenuItem;
      }
    }
  }

  const menuElements = makeMenuItems(menuItems, location);

  return <div>
    <div className='Menu'>
      <Wrapper className="AriaMenuButton">
        <Button tag="button" className="AriaMenuButton-trigger">
          <div className='Burger-menu'></div>
        </Button>
        <Menu>
          <ul className="AriaMenuButton-menu">
            {menuElements}
          </ul>
        </Menu>
      </Wrapper>
      <div className="Header-brand">
      </div>
      <div className="User-block">
        <UserWidget />
      </div>
    </div>
  </div>;
};

export default withRouter(observer(header));
