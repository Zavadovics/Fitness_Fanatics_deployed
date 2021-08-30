import React from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import './navbar.scss';
import user from '../../../images/user.png';

const Navbar = ({ loggedInUser, setLoggedInUser, userPhoto }) => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    setLoggedInUser('');
    history.push('/');
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark'>
      <div className='container-fluid'>
        {loggedInUser ? (
          <div className='logged-in-cont'>
            <div className='left'>
              <p>
                Üdv <span>{loggedInUser.firstName}</span> !
              </p>
              <div className='nav-user-photo-cont'>
                {userPhoto !== '' ? (
                  <img src={userPhoto} alt='' />
                ) : (
                  <img src={user} alt='' />
                )}
              </div>
            </div>
            <button type='button' className='navbar-btn' onClick={handleLogout}>
              KIJELENTKEZÉS
            </button>
          </div>
        ) : (
          <>
            <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarSupportedContent'
              aria-controls='navbarSupportedContent'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon' />
            </button>
            <div
              className='collapse navbar-collapse'
              id='navbarSupportedContent'
            >
              <ul className='navbar-nav nav-item-flex mb-lg-0'>
                <div className='ms-lg-2'>
                  <NavLink to='/' exact className='nav-link'>
                    <li>Főoldal</li>
                  </NavLink>
                </div>
                <div className='nav-item-flex me-lg-2'>
                  <NavLink to='/register' className='nav-link'>
                    <li className='w-100 reg-link'>Regisztráció</li>
                  </NavLink>
                  <div
                    className='vertical-line'
                    style={{ height: '45px' }}
                  ></div>
                  <NavLink exact to='/login' className='nav-link'>
                    <li className='w-100'>Bejelentkezés</li>
                  </NavLink>
                </div>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
