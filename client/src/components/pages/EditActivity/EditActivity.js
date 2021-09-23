import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ActivityForm from '../../common/ActivityForm/ActivityForm';
import bg from '../../../images/background.jpg';
import './editActivity.scss';

const EditActivity = ({ loggedInUser }) => {
  const { REACT_APP_SERVER_URL } = process.env;
  const { id } = useParams();
  const [activity, setActivity] = useState('');
  const [error, setError] = useState(null);

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
          throw Error(
            `could not fetch the data from database, error ${res.status}`
          );
        }
        return res.json();
      })
      .then(jsonRes => {
        setActivity(
          jsonRes.filter(singleActivity => singleActivity._id === id)
        );
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  return (
    <main
      className='edit-activity-cont'
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h2 className='inner-h2'>Edit activity</h2>
      {error && <div className='error'>{error}</div>}
      {activity && (
        <ActivityForm
          type='edit'
          activity={activity[0]}
          loggedInUser={loggedInUser}
        />
      )}
    </main>
  );
};

export default EditActivity;
