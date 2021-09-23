import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../images/fitness.jpg';
import './home.scss';
import Navbar from '../../common/Navbar/Navbar';
import Footer from '../../common/Footer/Footer';

const Home = () => {
  return (
    <>
      <div className='overlay'>
        <div className='home-navbar-cont'>
          <Navbar />
        </div>
        <div className='home-cont'>
          <div className='title-cont'>
            <h1>Fitness Fanatics</h1>
            <h4>Please register / login to use the app</h4>
            <div className='buttons'>
              <NavLink to='/register'>
                <button type='button' className='home-btn'>
                  REGISTRATION
                </button>
              </NavLink>
              <NavLink to='/login'>
                <button type='button' className='home-btn'>
                  LOGIN
                </button>
              </NavLink>
            </div>
          </div>
          <div className='img-cont'>
            <img className='home-img' src={logo} alt='home-img' />
          </div>
        </div>
        <div className='home-footer-cont'>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
