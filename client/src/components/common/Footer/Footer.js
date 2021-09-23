import React from 'react';
import logo from '../../../images/runner.png';
import './footer.scss';

const Footer = () => {
  return (
    <>
      <footer className='main-footer'>
        <p>Copyright &copy; 2021 </p>
        <img className='footer-logo' src={logo} alt='logo' />
        <p>All rights reserved</p>
      </footer>
    </>
  );
};

export default Footer;
