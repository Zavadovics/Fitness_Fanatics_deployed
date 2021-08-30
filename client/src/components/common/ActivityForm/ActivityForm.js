import React, { useState, useRef } from 'react';
import InputField from '../InputField/InputField';
import ItemSelect from '../ItemSelect/ItemSelect';
import {
  isFieldEmpty,
  isValueNegative,
  isDateInFuture,
} from '../../../utils/validators';
import {
  isFormValid,
  handleInputChange,
  handleInputBlur,
} from '../../../utils/form-validation';
import './activityForm.scss';

const ActivityForm = ({ type, activity, loggedInUser }) => {
  const { REACT_APP_SERVER_URL } = process.env;
  const activityTypeList = ['futás', 'kerékpározás', 'úszás'];
  const [formData, setFormData] = useState(
    type === 'edit'
      ? activity
      : {
          activityDate: '',
          activityTime: '',
          duration: '',
          activityType: '',
          distance: '',
          comment: '',
        }
  );

  const [alert, setAlert] = useState(null);
  const [formWasValidated, setFormWasValidated] = useState(false);

  const references = {
    activityDate: useRef(),
    activityTime: useRef(),
    duration: useRef(),
    activityType: useRef(),
    distance: useRef(),
    comment: useRef(),
  };

  const formErrorTypes = Object.freeze({
    required: `A mező kitöltése kötelező`,
    positive: `A megadott érték nagyobb kell hogy legyen mint 0.`,
    futureDate: `Kérlek egy múltbeli dátumot addj meg!`,
  });

  const [formErrors, setFormErrors] = useState({
    activityDate: '',
    activityTime: '',
    duration: '',
    activityType: '',
    distance: '',
    comment: '',
  });

  const validators = {
    activityDate: {
      required: isFieldEmpty,
      futureDate: isDateInFuture,
    },
    activityTime: {
      required: isFieldEmpty,
    },
    duration: {
      required: isFieldEmpty,
      positive: isValueNegative,
    },
    activityType: {
      required: isFieldEmpty,
    },
    distance: {
      required: isFieldEmpty,
      positive: isValueNegative,
    },
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setAlert(null);
    setFormErrors({
      activityDate: '',
      activityTime: '',
      duration: '',
      activityType: '',
      distance: '',
      comment: '',
    });
    setFormWasValidated(false);
    const isValid = isFormValid(
      formData,
      setFormErrors,
      validators,
      references,
      formErrorTypes
    );
    if (isValid) {
      if (type === 'new') {
        await fetch(`${REACT_APP_SERVER_URL}/api/activities`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
          body: JSON.stringify({
            user_id: loggedInUser.id,
            email: loggedInUser.email,
            activityDate: formData.activityDate,
            activityTime: formData.activityTime,
            duration: formData.duration,
            activityType: formData.activityType,
            distance: formData.distance,
            comment: formData.comment,
          }),
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
              activityDate: '',
              activityTime: '',
              duration: '',
              activityType: '',
              distance: '',
              comment: '',
            });
            e.target.reset();
          })
          .catch(err => {
            window.scrollTo(0, 0);
            setAlert({ alertType: 'danger', message: err.message });
          });
      }
      if (type === 'edit') {
        await fetch(`${REACT_APP_SERVER_URL}/api/activities/${activity._id}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
          body: JSON.stringify({
            user_id: loggedInUser.id,
            email: loggedInUser.email,
            activityDate: formData.activityDate,
            activityTime: formData.activityTime,
            duration: formData.duration,
            activityType: formData.activityType,
            distance: formData.distance,
            comment: formData.comment,
          }),
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
            setTimeout(() => {
              setAlert({
                alertType: 'success',
                message: res.message,
              });
            }, 3000);
          })
          .catch(err => {
            window.scrollTo(0, 0);
            setAlert({ alertType: 'danger', message: err.message });
          });
      }
      setFormWasValidated(false);
    } else {
      setFormWasValidated(true);
    }
  };

  return (
    <>
      <div className='activity-form-cont'>
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
              name='activityDate'
              id='activityDate'
              type='date'
              labelText='Dátum *'
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
              value={formData.activityDate}
              reference={references.activityDate}
              error={formErrors.activityDate}
            />
            <InputField
              name='activityTime'
              id='activityTime'
              type='time'
              labelText='Idő *'
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
              value={formData.activityTime}
              reference={references.activityTime}
              error={formErrors.activityTime}
            />
            <InputField
              name='duration'
              id='duration'
              type='number'
              labelText='Időtartam (perc) *'
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
              value={formData.duration}
              reference={references.duration}
              error={formErrors.duration}
            />
            <ItemSelect
              labelText='Tevékenység típusa *'
              name='activityType'
              id='activityType'
              formValue={formData.activityType}
              valueList={activityTypeList}
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
              reference={references['activityType']}
              formError={formErrors.activityType}
            />
            <InputField
              name='distance'
              id='distance'
              type='number'
              labelText='Távolság (méter) *'
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
              value={formData.distance}
              reference={references.distance}
              error={formErrors.distance}
            />
            <InputField
              name='comment'
              id='comment'
              type='comment'
              labelText='Megjegyzés'
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
              value={formData.comment}
              reference={references.comment}
              error={formErrors.comment}
            />
          </div>
          <button type='submit' className='activity-btn'>
            MENTÉS
          </button>
        </form>
      </div>
    </>
  );
};

export default ActivityForm;
