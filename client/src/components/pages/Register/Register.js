import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from '../../common/Navbar/Navbar';
import Footer from '../../common/Footer/Footer';
import InputField from '../../common/InputField/InputField';
import {
  isFieldEmpty,
  isEmailInvalid,
  isPasswordValid,
} from '../../../utils/validators';
import {
  isFormValid,
  onTickChange,
  handleInputChange,
  handleInputBlur,
} from '../../../utils/form-validation';
import './register.scss';

const Register = () => {
  const { REACT_APP_SERVER_URL, REACT_APP_GOOGLE_RECAPTCHA_KEY } = process.env;

  const [verified, setVerified] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState(null);
  const [formWasValidated, setFormWasValidated] = useState(false);

  const references = {
    firstName: useRef(),
    lastName: useRef(),
    email: useRef(),
    password: useRef(),
  };

  const formErrorTypes = Object.freeze({
    required: `Please fill me in`,
    passwordLength: `The passwords needs to be at least 8 characters long`,
    validEmail: `E-mail is not the right format`,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const messageTypes = Object.freeze({
    failCaptcha: `Please prove me that you're not a robot 🤖`,
  });

  const validators = {
    firstName: {
      required: isFieldEmpty,
    },
    lastName: {
      required: isFieldEmpty,
    },
    email: {
      required: isFieldEmpty,
      validEmail: isEmailInvalid,
    },
    password: {
      required: isFieldEmpty,
      passwordLength: isPasswordValid,
    },
  };

  const handleRegister = async e => {
    e.preventDefault();
    setAlert(null);
    setFormErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
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
      await fetch(`${REACT_APP_SERVER_URL}/api/user`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(async res => {
          if (res.status >= 300 || res.status < 200) {
            const response = await res.json();
            throw new Error(response?.message);
          }
          return res.json();
        })
        .then(res => {
          window.scrollTo(0, 0);
          setAlert({ alertType: 'success', message: res.message });
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
          });
          setVerified(false);
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
      <div className='register-cont'>
        <h1 className='outer-h1'>Registration</h1>
        <div className='alert-cont'>
          {alert && (
            <p className={`alert alert-${alert.alertType}`}>{alert.message}</p>
          )}
        </div>
        <form
          noValidate
          onSubmit={handleRegister}
          className={`needs-validation ${formWasValidated && 'was-validated'}`}
        >
          <div className='input'>
            <InputField
              name='firstName'
              type='text'
              labelText='First name *'
              value={formData.firstName}
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
              reference={references.firstName}
              error={formErrors.firstName}
              required
            />
            <InputField
              name='lastName'
              type='text'
              labelText='Last name *'
              value={formData.lastName}
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
              reference={references.lastName}
              error={formErrors.lastName}
              required
            />
            <InputField
              name='email'
              type='email'
              labelText='E-mail address *'
              value={formData.email}
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
            <InputField
              name='password'
              passwordShown={passwordShown}
              setPasswordShown={setPasswordShown}
              type={passwordShown ? 'text' : 'password'}
              labelText='Password - (min 8 characters) *'
              value={formData.password}
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
              reference={references.password}
              error={formErrors.password}
              required
            />
            <ReCAPTCHA
              hl='en'
              className='captcha'
              sitekey={REACT_APP_GOOGLE_RECAPTCHA_KEY}
              onChange={() => {
                onTickChange(setVerified);
              }}
            />
          </div>
          <p>
            <Link to='/login' className='text-link'>
              Already registered? Login here
            </Link>
          </p>
          <button type='submit' className='register-btn'>
            REGISTRATION
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
