import React from 'react';
import { NavLink } from 'react-router-dom';
import user from '../../../images/user.png';
import bg from '../../../images/background.jpg';
import './profile.scss';

const Profile = ({ loggedInUser, profile, userPhoto }) => {
  return (
    <>
      <div
        className='view-profile-cont'
        style={{ backgroundImage: `url(${bg})` }}
      >
        <h2 className='inner-h2'>Saját profil</h2>
        <div className='profile-card'>
          <div className='user-photo-cont'>
            {userPhoto !== '' ? (
              <img src={userPhoto} alt='' />
            ) : (
              <img src={user} alt='' />
            )}
          </div>
          <div className='text-cont'>
            <div className='text-row'>
              <p>Felhasználónév:</p>
              <p>{profile.userName}</p>
            </div>
            <div className='text-row'>
              <p>Vezetéknév:</p>
              <p>{profile.lastName}</p>
            </div>
            <div className='text-row'>
              <p>Keresztnév:</p>
              <p>{profile.firstName}</p>
            </div>
            <div className='text-row'>
              <p>Email cím:</p>
              <p>{profile.email}</p>
            </div>
            <div className='text-row'>
              <p>Nem:</p>
              <p>{profile.gender}</p>
            </div>
            <div className='text-row'>
              <p>Tartózkodási hely:</p>
              <p>{profile.cityOfResidence}</p>
            </div>
            <div className='text-row'>
              <p>Testsúly:</p>
              {profile.weight === 0 ? <p></p> : <p>{profile.weight}</p>}
            </div>
            <div className='text-row'>
              <p>Születési dátum:</p>
              {profile.birthDate ===
                'Thu Jan 01 1970 01:00:00 GMT+0100 (Central European Standard Time)' ||
              profile.birthDate === '' ? (
                <p></p>
              ) : (
                <p>{profile.birthDate}</p>
              )}
            </div>
            <div className='text-row'>
              <p>Motivációs szöveg:</p>
              <p>{profile.motivation}</p>
            </div>
          </div>
          <NavLink to={`/profile/edit/${loggedInUser.id}`}>
            <button type='button' className='prof-mod-btn'>
              MÓDOSÍTÁS
            </button>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Profile;
