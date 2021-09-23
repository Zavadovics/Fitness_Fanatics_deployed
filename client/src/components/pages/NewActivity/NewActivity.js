import ActivityForm from '../../common/ActivityForm/ActivityForm';
import bg from '../../../images/background.jpg';
import './newActivity.scss';

const NewActivity = ({ loggedInUser }) => {
  return (
    <main
      className='new-activity-cont'
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h2 className='inner-h2'>New activity</h2>
      <ActivityForm type='new' loggedInUser={loggedInUser} />
    </main>
  );
};

export default NewActivity;
