import React, { useState, useRef } from 'react';
import DeleteModal from '../DeleteModal/DeleteModal';
import { NavLink } from 'react-router-dom';
import {
  meterToKilometers,
  minsToHoursAndMins,
  calorieCounter,
} from '../../../utils/helper';
import './card.scss';
import Moment from 'react-moment';
import 'moment/locale/hu';

const Card = ({
  loggedInUser,
  profile,
  activity,
  activities,
  setActivities,
  setAlert,
}) => {
  const { REACT_APP_SERVER_URL } = process.env;
  const [activityToBeDeleted, setActivityToBeDeleted] = useState(null);
  const deleteModalRef = useRef();

  const handleDeleteConfirm = () => {
    fetch(`${REACT_APP_SERVER_URL}/api/activities/${activityToBeDeleted}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loggedInUser.token}`,
      },
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
        setTimeout(() => {
          setAlert(null);
        }, 3000);
        setActivities(
          activities.filter(
            updatedActivities => updatedActivities._id !== activityToBeDeleted
          )
        );
      })
      .catch(err => {
        console.error('err', err);
        window.scrollTo(0, 0);
      });
  };

  const handleDeleteOnClick = e => {
    setActivityToBeDeleted(e.target.dataset.id);
  };

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <h5 className='card-title'>
            <Moment format='LL'>{activity.activityDate}</Moment>-{' '}
            <span>{activity.activityTime}</span>
          </h5>
          <h5 className='card-title'>
            <span>{activity.activityType}</span>
          </h5>
          <h6 className='card-subtitle mb-2 text-muted'>
            {minsToHoursAndMins(activity.duration)} -{' '}
            {meterToKilometers(activity.distance)} KM
            {!profile.weight ? (
              <p></p>
            ) : (
              <span className='card-subtitle mb-2 text-muted'>
                {' - '}
                {calorieCounter(activity.duration, profile.weight)} kalória
              </span>
            )}
          </h6>
          <p className='card-text pt-2 comment'>{activity.comment}</p>
        </div>
        <div className='card-button-container'>
          <NavLink to={`/activities/edit/${activity._id}`}>
            <button type='button' className='card-mod-btn'>
              MÓDOSÍTÁS
            </button>
          </NavLink>
          <button
            className='card-del-btn'
            type='button'
            data-id={activity._id}
            onClick={handleDeleteOnClick}
            data-bs-target='#myModal'
            data-bs-toggle='modal'
          >
            TÖRLÉS
          </button>
        </div>
      </div>
      <DeleteModal
        handleDeleteConfirm={handleDeleteConfirm}
        deleteModalRef={deleteModalRef}
        type='Card'
      />
    </>
  );
};

export default Card;
