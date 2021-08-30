import React, { useEffect, useState } from 'react';
import Navbar from '../../common/Navbar/Navbar';
import Footer from '../../common/Footer/Footer';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import './activation.scss';

const Activation = () => {
  const { REACT_APP_SERVER_URL } = process.env;
  const history = useHistory();
  const activation_token = useParams();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (activation_token) {
      fetch(`${REACT_APP_SERVER_URL}/api/user/activation`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activation_token),
      })
        .then(async res => {
          if (res.status === 401) {
            const response = await res.json();
            throw new Error(response?.message);
          }
          return res.json();
        })
        .then(res => {
          window.scrollTo(0, 0);
          setAlert({ alertType: 'success', message: res.message });
          setTimeout(() => {
            history.push('/login');
          }, 3000);
        })
        .catch(err => {
          window.scrollTo(0, 0);
          setAlert({ alertType: 'danger', message: err.message });
        });
    }
  }, [activation_token]);

  return (
    <>
      <Navbar />
      <div className='activation-cont'>
        <h1 className='outer-h1'>Új fiók aktiválása</h1>
        <div className='alert-cont'>
          {alert && (
            <p className={`alert alert-${alert.alertType}`}>{alert.message}</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Activation;
