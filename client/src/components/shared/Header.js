import React from 'react'; // eslint-disable-line no-unused-vars
import { Link, withRouter } from 'react-router-dom';
import { matchPath } from 'react-router';
import { observer } from 'mobx-react';
import decamelize from 'decamelize';
import string from 'string';
import {
  Button, Wrapper,
  Menu, MenuItem,
} from 'react-aria-menubutton';
import { features } from 'hermetic-common';
import viewRoutes from '../../viewRoutes';
import UserWidget from './UserWidget';
import userStore from '../../stores/userStore';
import constants from '../../constants';

const makeMenuItem = (title, linkTo, current, depth) => <li
  className="AriaMenuButton-menuItemWrapper"
  key={title}>
    <MenuItem value={title} className={`AriaMenuButton-menuItem ${current ? 'current' : ''}`}>
    <Link to={linkTo}>
      <div className={`Link-depth-${depth}`}>{title}</div>
    </Link>
    </MenuItem>
</li>;

const header = ({ location }) => {
  const currentRoute = viewRoutes.find(r => matchPath(location.pathname, r));

  const firstLevelRoutes = viewRoutes
    .filter(r => r.menu.crumbs.length === 1)
    .filter(r => (!r.securityFeature)
      || userStore.data.allowedFeatures.includes(r.securityFeature))
    .sort((a, b) => (a.menu.displayOrder || 0) - (b.menu.displayOrder || 0));

  const menuItems = firstLevelRoutes
    .map(r => makeMenuItem(r.menu.crumbs[0], r.path, r === currentRoute, 1));

  const splitPath = location.pathname.split('/');

  // show child items on the menu if we are at a child item, otherwise don't
  if (currentRoute && (currentRoute.menu.crumbs.length > 1)) {
    const parentItemIndex = firstLevelRoutes
      .findIndex(r => r.menu.crumbs[0] === currentRoute.menu.crumbs[0]);
    for (let i = 1;
      (i < currentRoute.menu.crumbs.length) && (i < (splitPath.length - 1));
      i += 1) {
      const crumbTitle = (currentRoute.menu.crumbs[i] === constants.menuItemEntityId)
        ? splitPath[i + 1] : currentRoute.menu.crumbs[i];
      const childMenuItem = makeMenuItem(crumbTitle, splitPath.slice(0, i + 2).join('/'),
        i === currentRoute.menu.crumbs.length - 1, i + 1);
      menuItems.splice(parentItemIndex + i, 0, childMenuItem);
    }
  }

  let helpAnchor;

  if (currentRoute) {
    helpAnchor = string(currentRoute.menu.crumbs
      .join(' ')
      .replace(constants.menuItemEntityId, 'Item')).slugify().toString();
  }

  if ((userStore.data.allowedFeatures.includes(features.edit))) {
    menuItems.push(makeMenuItem('Edit', '/edit', location.pathname === '/edit', 1));
    if ((splitPath.length > 2) && (splitPath[1] === 'edit')) {
      const crumbTitle = decamelize(splitPath[2], ',')
        .split(',').map(word => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
        .join(' ');
      menuItems.push(makeMenuItem(crumbTitle, splitPath.slice(0, 3).join('/'),
        true, 2));
      helpAnchor = string(`edit ${crumbTitle}`).slugify().toString();
    }
    if ((!helpAnchor) && (splitPath.length > 1) && (splitPath[1] === 'edit')) {
      helpAnchor = 'edit';
    }
  }

  return <div>
    <div className='Menu'>
      <Wrapper className="AriaMenuButton">
        <Button tag="button" className="AriaMenuButton-trigger">
          <div className='Burger-menu'></div>
        </Button>
        <Menu>
          <ul className="AriaMenuButton-menu">
            {menuItems}
          </ul>
        </Menu>
      </Wrapper>
      <div className="Header-brand">
      </div>
      <div className="User-block">
        <UserWidget />
      </div>
      <div className="Help-menu-block">
        <a href={`/help/index.html#${helpAnchor || ''}`} target='_blank'
          rel="noopener noreferrer">
          <div className="Help-link" />
        </a>
      </div>
    </div>
  </div>;
};

export default withRouter(observer(header));
