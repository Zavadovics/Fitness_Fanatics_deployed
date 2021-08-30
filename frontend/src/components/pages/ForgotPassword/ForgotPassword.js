import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from '../../common/Navbar/Navbar';
import Footer from '../../common/Footer/Footer';
import InputField from '../../common/InputField/InputField';
import { isFieldEmpty, isEmailInvalid } from '../../../utils/validators';
import {
  isFormValid,
  onTickChange,
  handleInputChange,
  handleInputBlur,
} from '../../../utils/form-validation';
import './forgotPassword.scss';

const ForgotPassword = ({ setLoggedInUser }) => {
  const { REACT_APP_SERVER_URL, REACT_APP_GOOGLE_RECAPTCHA_KEY } = process.env;
  const [verified, setVerified] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
  });

  const [alert, setAlert] = useState(null);
  const [formWasValidated, setFormWasValidated] = useState(false);

  const references = {
    email: useRef(),
  };

  const formErrorTypes = Object.freeze({
    required: `A mező kitöltése kötelező`,
    validEmail: `Nem megfelelő email formátum`,
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
  });

  const messageTypes = Object.freeze({
    failCaptcha: `Kérlek bizonyítsd be hogy nem vagy robot 🤖`,
  });

  const validators = {
    email: {
      required: isFieldEmpty,
      validEmail: isEmailInvalid,
    },
  };

  const handleReset = async e => {
    e.preventDefault();
    setAlert(null);
    setFormErrors({
      email: '',
    });

    setFormWasValidated(false);
    const isValid = isFormValid(
      formData,
      setFormErrors,
      validators,
      references,
      formErrorTypes
    );
    if (isValid && verified) {
      await fetch(`${REACT_APP_SERVER_URL}/api/password`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      })
        .then(async res => {
          if (res.status === 400) {
            const response = await res.json();
            throw new Error(response?.message);
          }
          return res.json();
        })
        .then(res => {
          window.scrollTo(0, 0);
          setFormData({
            email: '',
          });
          localStorage.clear();
          setLoggedInUser('');
          setVerified(false);
          setAlert({ alertType: 'success', message: res.message });
        })
        .catch(err => {
          window.scrollTo(0, 0);
          setAlert({ alertType: 'danger', message: err.message });
        });
    } else if (!verified && isValid) {
      window.scrollTo(0, 0);
      setAlert({
        alertType: 'danger',
        message: messageTypes.failCaptcha,
      });
    } else {
      setFormWasValidated(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className='password-cont'>
        <h1 className='outer-h1'>Elfelejtett jelszó</h1>
        <div className='alert-cont'>
          {alert && (
            <p className={`alert alert-${alert.alertType}`}>{alert.message}</p>
          )}
        </div>
        <form
          noValidate
          onSubmit={handleReset}
          className={`needs-validation ${formWasValidated && 'was-validated'}`}
        >
          <div className='input'>
            <InputField
              name='email'
              type='email'
              value={formData.email}
              labelText='Email cím *'
              onChange={e => {
                handleInputChange(e, formData, setFormData);
              }}
              onBlur={e => {
                handleInputBlur(
                  e,
                  formData,
                  setFormErrors,
                  validators,
                  references,
                  formErrorTypes
                );
              }}
              reference={references.email}
              error={formErrors.email}
              required
            />
            <ReCAPTCHA
              className='captcha'
              sitekey={REACT_APP_GOOGLE_RECAPTCHA_KEY}
              onChange={() => {
                onTickChange(setVerified);
              }}
            />
          </div>
          <button type='submit' className='password-btn'>
            KÜLDÉS
          </button>
          <p>
            <Link to='/' className='text-link'>
              Vissza a főoldalra
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
