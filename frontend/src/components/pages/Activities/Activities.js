import React, { useState, useEffect } from 'react';
import Card from '../../common/Card/Card';
import back from '../../../images/background.jpg';
import './activities.scss';

const Activities = ({ profile, loggedInUser }) => {
  const { REACT_APP_SERVER_URL } = process.env;
  const [activities, setActivities] = useState([]);
  const [alert, setAlert] = useState(null);

  const messageTypes = Object.freeze({
    dbProblem: `Adatbázis probléma.`,
  });

  useEffect(() => {
    fetch(`${REACT_APP_SERVER_URL}/api/activities/${loggedInUser.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
      .then(res => {
        if (res.status !== 200) {
          setAlert({ alertType: 'danger', message: messageTypes.dbProblem });
          throw Error(
            `could not fetch the data from database, error ${res.status}`
          );
        }
        return res.json();
      })
      .then(jsonRes => {
        setActivities(jsonRes);
      })
      .catch(err => {
        setAlert({ alertType: 'danger', message: messageTypes.dbProblem });
      });
  }, []);

  return (
    <>
      <div
        className='activities-cont'
        style={{ backgroundImage: `url(${back})` }}
      >
        <h2 className='inner-h2'>Tevékenységek</h2>
        <div className='alert-cont-activities'>
          {alert && (
            <p className={`alert alert-${alert.alertType}`}>{alert.message}</p>
          )}
        </div>
        {activities.length === 0 ? (
          <p className='no-activities'>
            Nincs egy megjeleníthető tevékenység sem.
          </p>
        ) : (
          <>
            {activities.map(activity => (
              <div className='card-cont' key={activity._id}>
                <Card
                  profile={profile}
                  activity={activity}
                  activities={activities}
                  setActivities={setActivities}
                  loggedInUser={loggedInUser}
                  setAlert={setAlert}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Activities;
