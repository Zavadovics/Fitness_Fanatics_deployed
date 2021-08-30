import { useState, useEffect, useRef } from 'react';
import InputField from '../../common/InputField/InputField';
import bg from '../../../images/background.jpg';
import { isFieldEmpty } from '../../../utils/validators';
import {
  isFormValid,
  handleInputChange,
  handleInputBlur,
} from '../../../utils/form-validation';
import './trainingPlans.scss';

const TrainingPlans = ({ loggedInUser }) => {
  const { REACT_APP_SERVER_URL } = process.env;
  const [alert, setAlert] = useState(null);
  const [plans, setPlans] = useState([]);
  const [newPlans, setNewPlans] = useState([]);
  const messageTypes = Object.freeze({
    missingFile: `Nincs hozzáadva feltöltendő fájl`,
    addedFile: `Feltöltendő fájl hozzáadva`,
  });

  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
  });

  const [formWasValidated, setFormWasValidated] = useState(false);

  const references = {
    title: useRef(),
  };

  const formErrorTypes = Object.freeze({
    required: `A mező kitöltése kötelező`,
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
  });

  const validators = {
    title: {
      required: isFieldEmpty,
    },
  };

  useEffect(() => {
    if (loggedInUser) {
      const getPlan = async () => {
        fetch(`${REACT_APP_SERVER_URL}/api/plan`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        })
          .then(res => {
            if (res.status !== 200) {
              throw Error(
                `could not fetch data from database, error ${res.status}`
              );
            }
            return res.json();
          })
          .then(jsonRes => {
            setPlans(jsonRes);
          })
          .catch(err => {
            console.error(err.message);
          });
      };
      getPlan();
    }
  }, [newPlans]);

  const handleFileChange = e => {
    setData(e.target.files[0]);
    setAlert({
      alertType: 'warning',
      message: messageTypes.addedFile,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setAlert(null);
    setFormErrors({
      title: '',
    });

    setFormWasValidated(false);
    const isValid = isFormValid(
      formData,
      setFormErrors,
      validators,
      references,
      formErrorTypes
    );
    let fileData = new FormData();
    fileData.append('image', data);
    fileData.append('user_id', loggedInUser.id);
    fileData.append('user_email', loggedInUser.email);
    fileData.append('title', formData.title);
    if (data === null) {
      return setAlert({
        alertType: 'danger',
        message: messageTypes.missingFile,
      });
    }
    if (data && isValid) {
      await fetch(`${REACT_APP_SERVER_URL}/api/plan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: fileData,
      })
        .then(async res => {
          if (res.status < 200 || res.status >= 300) {
            const response = await res.json();
            throw new Error(response?.message);
          }
          return res.json();
        })
        .then(res => {
          window.scrollTo(0, 0);
          setAlert({
            alertType: 'success',
            message: res.message,
          });
          setFormData({
            title: '',
          });
          setData(null);
          setNewPlans([...plans, res.plan]);
        })
        .catch(err => {
          window.scrollTo(0, 0);
          setAlert({ alertType: 'danger', message: err.message });
        });
    } else {
      setFormWasValidated(true);
    }
  };

  return (
    <div
      className='training-plan-cont'
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h2 className='inner-h2'>Edzéstervek</h2>
      <div className='alert-cont'>
        {alert && (
          <p className={`alert alert-${alert.alertType}`}>{alert.message}</p>
        )}
      </div>
      <form
        noValidate
        onSubmit={handleSubmit}
        className={`needs-validation ${formWasValidated && 'was-validated'}`}
      >
        <p>
          Van egy edzésterved ami hasznos lehet másoknak? Itt feltöltheted az
          adatbázisba.
        </p>
        <input
          className='form-control pdf-inputfile'
          name='image'
          type='file'
          id='file'
          accept='/image/*'
          onChange={handleFileChange}
        />
        <label className='pdf-input-label' htmlFor='file'>
          Válassz egy fájlt (Kattints ide)
        </label>
        <InputField
          centerClass='center'
          name='title'
          type='text'
          labelText='Edzésterv elnevezése *'
          value={formData.title}
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
          reference={references.title}
          error={formErrors.title}
        />
        <button className='photo-btn'>Küldés</button>
      </form>
      <>
        {plans.map(plan => (
          <div className='object-outer-cont' key={plan._id}>
            <div className='object-cont'>
              <p className='object-title'>{plan.title}</p>
              <object
                className='object-preview'
                data={plan.avatar}
                type='application/pdf'
              >
                <p>
                  {plan.originalName} -{' '}
                  <a target='_blank' rel='noreferrer' href={plan.avatar}>
                    megnyitás
                  </a>
                </p>
              </object>
              <p className='object-text'>
                {plan.originalName} -{' '}
                <a target='_blank' rel='noreferrer' href={plan.avatar}>
                  megnyitás
                </a>
              </p>
            </div>
          </div>
        ))}
      </>
    </div>
  );
};

export default TrainingPlans;
