import React, { useState } from 'react';
import './sidebar.scss';
import { NavLink } from 'react-router-dom';
import {
  FaRunning,
  FaPlusSquare,
  FaUser,
  FaUserEdit,
  FaCameraRetro,
  FaDumbbell,
} from 'react-icons/fa';

const Sidebar = ({ loggedInUser }) => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <nav className={sidebar ? 'sidebar-nav-menu active' : 'sidebar-nav-menu'}>
        <ul>
          <li className='sidebar-toggle' onClick={showSidebar}>
            <div className={sidebar ? 'menu-btn open' : 'menu-btn'}>
              <div className='menu-btn__burger'></div>
            </div>
          </li>
          <li className='sidebar-list-item'>
            <NavLink
              className='sidebar-item'
              exact
              to='/activities'
              activeClassName='activeClicked'
            >
              <FaRunning className='sidebar-icon' />
              <span className={sidebar ? 'span show' : 'span hide'}>
                Activities
              </span>
            </NavLink>
          </li>
          <li className='sidebar-list-item'>
            <NavLink
              className='sidebar-item'
              exact
              to='/activities/new'
              activeClassName='activeClicked'
            >
              <FaPlusSquare className='sidebar-icon' />
              <span className={sidebar ? 'span show' : 'span hide'}>
                New activity
              </span>
            </NavLink>
          </li>
          <li className='sidebar-list-item'>
            <NavLink
              className='sidebar-item'
              exact
              to='/profile'
              activeClassName='activeClicked'
            >
              <FaUser className='sidebar-icon' />
              <span className={sidebar ? 'span show' : 'span hide'}>
                My profile
              </span>
            </NavLink>
          </li>
          <li className='sidebar-list-item'>
            <NavLink
              className='sidebar-item'
              exact
              to={`/profile/edit/${loggedInUser.id}`}
              activeClassName='activeClicked'
            >
              <FaUserEdit className='sidebar-icon edit' />
              <span className={sidebar ? 'span show edit' : 'span hide'}>
                Edit profile
              </span>
            </NavLink>
          </li>
          <li className='sidebar-list-item'>
            <NavLink
              className='sidebar-item'
              exact
              to={`/profile/photo/edit/${loggedInUser.id}`}
              activeClassName='activeClicked'
            >
              <FaCameraRetro className='sidebar-icon' />
              <span className={sidebar ? 'span show' : 'span hide'}>
                Profile photo
              </span>
            </NavLink>
          </li>
          <li className='sidebar-list-item'>
            <NavLink
              className='sidebar-item'
              exact
              to='/training-plans'
              activeClassName='activeClicked'
            >
              <FaDumbbell className='sidebar-icon' />
              <span className={sidebar ? 'span show' : 'span hide'}>
                Training plans
              </span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
