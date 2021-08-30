import { useState, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useParams } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from '../../common/Navbar/Navbar';
import Footer from '../../common/Footer/Footer';
import InputField from '../../common/InputField/InputField';
import { isFieldEmpty, isPasswordValid } from '../../../utils/validators';
import {
  isFormValid,
  onTickChange,
  handleInputChange,
  handleInputBlur,
} from '../../../utils/form-validation';
import './resetPassword.scss';

const ResetPassword = () => {
  const { REACT_APP_SERVER_URL, REACT_APP_GOOGLE_RECAPTCHA_KEY } = process.env;
  const [verified, setVerified] = useState(false);
  const history = useHistory();
  const { id, token } = useParams();
  const [passwordShown, setPasswordShown] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [alert, setAlert] = useState(null);
  const [formWasValidated, setFormWasValidated] = useState(false);

  const references = {
    newPassword: useRef(),
    confirmPassword: useRef(),
  };

  const formErrorTypes = Object.freeze({
    required: `A mező kitöltése kötelező`,
    passwordLength: `A jelszó legalább 8 karakter hosszú kell legyen`,
    passwordMatch: `A megadott jelszavak nem egyeznek.`,
  });

  const [formErrors, setFormErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const messageTypes = Object.freeze({
    failCaptcha: `Kérlek bizonyítsd be hogy nem vagy robot 🤖`,
  });

  const isConfirmPasswordMatch = value => value === formData.newPassword;

  const validators = {
    newPassword: {
      required: isFieldEmpty,
      passwordLength: isPasswordValid,
      passwordMatch: isConfirmPasswordMatch,
    },
    confirmPassword: {
      required: isFieldEmpty,
      passwordLength: isPasswordValid,
      passwordMatch: isConfirmPasswordMatch,
    },
  };

  const handleReset = async e => {
    e.preventDefault();
    setAlert(null);
    setFormErrors({
      newPassword: '',
      confirmPassword: '',
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
      await fetch(`${REACT_APP_SERVER_URL}/api/password-reset/${id}/${token}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.newPassword,
        }),
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
          setFormData({
            newPassword: '',
            confirmPassword: '',
          });
          setVerified(false);
          setAlert({ alertType: 'success', message: res.message });
          setTimeout(() => {
            history.push('/login');
          }, 3000);
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
      <div className='reset-password-cont'>
        <h1 className='outer-h1'>Jelszó cseréje</h1>
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
              name='newPassword'
              passwordShown={passwordShown}
              setPasswordShown={setPasswordShown}
              type={passwordShown ? 'text' : 'password'}
              labelText='Új jelszó - (legalább 8 karakter) *'
              value={formData.newPassword}
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
              reference={references.newPassword}
              error={formErrors.newPassword}
              required
            />
            <InputField
              name='confirmPassword'
              passwordShown={passwordShown}
              setPasswordShown={setPasswordShown}
              type={passwordShown ? 'text' : 'password'}
              labelText='Jelszó még egyszer *'
              value={formData.confirmPassword}
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
              reference={references.confirmPassword}
              error={formErrors.confirmPassword}
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

export default ResetPassword;
