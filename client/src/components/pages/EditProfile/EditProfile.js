import { useEffect, useState, useRef } from 'react';
import InputField from '../../common/InputField/InputField';
import ItemSelect from '../../common/ItemSelect/ItemSelect';
import validator from 'validator';
import bg from '../../../images/background.jpg';
import './editProfile.scss';

const EditProfile = ({ profile, setProfile, loggedInUser }) => {
  const { REACT_APP_SERVER_URL } = process.env;
  const [cities, setCities] = useState([]);
  const genderList = ['férfi', 'nő', 'nem szeretném megadni'];
  const [formData, setFormData] = useState(profile);
  const [alert, setAlert] = useState(null);
  const [formWasValidated, setFormWasValidated] = useState(false);

  useEffect(() => {
    fetch(`${REACT_APP_SERVER_URL}/api/cities`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
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
        const cityValues = [];
        for (let i = 0; i < jsonRes.length; i++) {
          cityValues.push(jsonRes[i].value);
        }
        setCities(cityValues);
      })
      .catch(err => {
        console.error(err.message);
      });
  }, []);

  const references = {
    firstName: useRef(),
    lastName: useRef(),
    email: useRef(),
    weight: useRef(),
    birthDate: useRef(),
  };

  const formErrorTypes = Object.freeze({
    required: `A mező kitöltése kötelező`,
    validEmail: `Nem megfelelő email formátum`,
    positive: `A megadott érték nagyobb kell hogy legyen mint 0.`,
    futureDate: `Kérlek egy múltbeli dátumot addj meg!`,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    weight: '',
    birthDate: '',
  });

  const isFieldEmpty = value => {
    return value !== '';
  };

  const isEmailInvalid = value => {
    return validator.isEmail(value);
  };

  const isValueNegative = value => {
    return value > 0;
  };

  const isDateInFuture = value => {
    const futureDate = new Date(value);
    const actualDate = new Date();
    return futureDate <= actualDate;
  };

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
    weight: {
      positive: isValueNegative,
    },
    birthDate: {
      futureDate: isDateInFuture,
    },
  };

  const validateField = fieldName => {
    console.log('formData', formData);
    const value = formData[fieldName];
    let isValid = true;
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: '',
    }));
    if (
      (formData.birthDate === undefined || formData.birthDate === '') &&
      (formData.weight === '' || formData.weight === undefined)
    ) {
      return true;
    }

    if (validators[fieldName] !== undefined) {
      for (const [validationType, validatorFn] of Object.entries(
        validators[fieldName]
      )) {
        if (isValid !== false) {
          isValid = validatorFn(value);
          if (!isValid) {
            const errorText = formErrorTypes[validationType];
            setFormErrors(prev => ({
              ...prev,
              [fieldName]: errorText,
            }));
            references[fieldName].current.setCustomValidity(errorText);
          }
        }
      }
    }
    return isValid;
  };

  const isFormValid = () => {
    let isValid = true;
    Object.keys(formData).forEach(fieldName => {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleInputBlur = e => {
    const { name } = e.target;
    validateField(name);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    e.target.setCustomValidity('');

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setAlert(null);
    setFormErrors({
      firstName: '',
      lastName: '',
      email: '',
      weight: '',
      birthDate: '',
    });

    setFormWasValidated(false);
    const isValid = isFormValid();
    if (isValid) {
      await fetch(`${REACT_APP_SERVER_URL}/api/user/${loggedInUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify({
          userName: formData.userName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: profile.password,
          gender: formData.gender,
          cityOfResidence: formData.cityOfResidence,
          weight: formData.weight,
          birthDate: formData.birthDate,
          motivation: formData.motivation,
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
          setAlert({ alertType: 'success', message: res.message });
          setProfile(formData);
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
    <>
      <div
        className='profile-edit-cont'
        style={{ backgroundImage: `url(${bg})` }}
      >
        <h2 className='inner-h2'>Profil módosítása</h2>
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
          <div className='input'>
            <InputField
              name='userName'
              type='text'
              labelText='Felhasználónév'
              onChange={handleInputChange}
              value={formData.userName || ''}
              onBlur={handleInputBlur}
            />
            <InputField
              name='lastName'
              type='text'
              labelText='Vezetéknév *'
              onChange={handleInputChange}
              value={formData.lastName}
              onBlur={handleInputBlur}
              reference={references.lastName}
              error={formErrors.lastName}
            />
            <InputField
              name='firstName'
              type='text'
              labelText='Keresztnév *'
              onChange={handleInputChange}
              value={formData.firstName}
              onBlur={handleInputBlur}
              reference={references.firstName}
              error={formErrors.firstName}
            />
            <InputField
              name='email'
              type='email'
              labelText='Email *'
              onChange={handleInputChange}
              value={formData.email}
              onBlur={handleInputBlur}
              reference={references.email}
              error={formErrors.email}
            />
            <ItemSelect
              labelText='Nem'
              name='gender'
              id='gender'
              formValue={formData.gender || ''}
              valueList={genderList}
              onChange={handleInputChange}
            />
            <ItemSelect
              labelText='Tartózkodási hely'
              name='cityOfResidence'
              id='cityOfResidence'
              formValue={formData.cityOfResidence || ''}
              valueList={cities}
              onChange={handleInputChange}
            />
            <InputField
              name='weight'
              type='number'
              labelText='Testsúly'
              onChange={handleInputChange}
              value={formData.weight || ''}
              onBlur={handleInputBlur}
              reference={references.weight}
              error={formErrors.weight}
            />
            <InputField
              name='birthDate'
              type='date'
              labelText='Születési dátum'
              onChange={handleInputChange}
              value={formData.birthDate || ''}
              onBlur={handleInputBlur}
              reference={references.birthDate}
              error={formErrors.birthDate}
            />
            <InputField
              name='motivation'
              type='motivation'
              labelText='Motivációs szöveg'
              onChange={handleInputChange}
              value={formData.motivation || ''}
              onBlur={handleInputBlur}
            />
          </div>
          <button type='submit' className='profile-edit-btn'>
            MENTÉS
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
