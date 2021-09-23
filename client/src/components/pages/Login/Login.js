import { useState, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
import './login.scss';

const Login = ({ loggedInUser, setLoggedInUser }) => {
  const { REACT_APP_SERVER_URL, REACT_APP_GOOGLE_RECAPTCHA_KEY } = process.env;
  const [verified, setVerified] = useState(false);
  const history = useHistory();

  const [passwordShown, setPasswordShown] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState(null);
  const [formWasValidated, setFormWasValidated] = useState(false);

  const references = {
    email: useRef(),
    password: useRef(),
  };

  const formErrorTypes = Object.freeze({
    required: `Please fill me in`,
    passwordLength: `The passwords needs to be at least 8 characters long`,
    validEmail: `E-mail is not the right format`,
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const messageTypes = Object.freeze({
    failCaptcha: `Please prove me that you're not a robot 🤖`,
  });

  const validators = {
    email: {
      required: isFieldEmpty,
      validEmail: isEmailInvalid,
    },
    password: {
      required: isFieldEmpty,
      passwordLength: isPasswordValid,
    },
  };

  const handleLogin = async e => {
    e.preventDefault();
    setAlert(null);
    setFormErrors({
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
      await fetch(`${REACT_APP_SERVER_URL}/api/login`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(async res => {
          if (res.status >= 400 && res.status <= 500) {
            const response = await res.json();
            throw new Error(response?.message);
          }
          return res.json();
        })
        .then(res => {
          const user = res;
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          setFormData({
            email: '',
            password: '',
          });
          setVerified(false);
          setAlert(null);
          history.push('/activities');
          window.location.reload();
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
      <Navbar setLoggedInUser={setLoggedInUser} loggedInUser={loggedInUser} />
      <div className='login-cont'>
        <h1 className='outer-h1'>Login</h1>
        <div className='alert-cont'>
          {alert && (
            <p className={`alert alert-${alert.alertType}`}>{alert.message}</p>
          )}
        </div>

        <form
          noValidate
          onSubmit={handleLogin}
          className={`needs-validation ${formWasValidated && 'was-validated'}`}
        >
          <div className='input'>
            <InputField
              name='email'
              type='email'
              value={formData.email}
              labelText='E-mail address *'
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
              value={formData.password}
              labelText='Password *'
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
            <Link to='/register' className='text-link'>
              Not registered yet? You can do it here
            </Link>
          </p>
          <p>
            <Link to='/password' className='text-link'>
              Forgotten your password? Get a new one here
            </Link>
          </p>
          <button type='submit' className='login-btn'>
            LOGIN
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
