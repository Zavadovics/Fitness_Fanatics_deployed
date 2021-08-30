import React, { useState, useRef } from 'react';
import DeleteModal from '../../common/DeleteModal/DeleteModal';
import user from '../../../images/user.png';
import bg from '../../../images/background.jpg';
import './editPhoto.scss';

const EditPhoto = ({ loggedInUser, userPhoto, setUserPhoto }) => {
  const { REACT_APP_SERVER_URL } = process.env;
  const [alert, setAlert] = useState(null);
  const [data, setData] = useState(null);
  const [photoToBeDeleted, setPhotoToBeDeleted] = useState(null);
  console.log('photoToBeDeleted', photoToBeDeleted);
  const deleteModalRef = useRef();
  const messageTypes = Object.freeze({
    missingFile: `Nincs hozzáadva feltöltendő fájl`,
    addedFile: `Feltöltendő fájl hozzáadva`,
  });

  const handleChange = e => {
    setData(e.target.files[0]);
    setAlert({
      alertType: 'warning',
      message: messageTypes.addedFile,
    });
  };

  const handleSubmit = async () => {
    let formData = new FormData();
    formData.append('image', data);
    formData.append('user_id', loggedInUser.id);
    formData.append('user_email', loggedInUser.email);
    if (data === null) {
      return setAlert({
        alertType: 'danger',
        message: messageTypes.missingFile,
      });
    }
    await fetch(`${REACT_APP_SERVER_URL}/api/photo/${loggedInUser.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
      },
      body: formData,
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
        setData(null);
        setUserPhoto(res.image);
      })
      .catch(err => {
        window.scrollTo(0, 0);
        setAlert({ alertType: 'danger', message: err.message });
      });
  };

  const handleDeleteConfirm = async () => {
    await fetch(`${REACT_APP_SERVER_URL}/api/photo/${loggedInUser.id}`, {
      method: 'DELETE',
      headers: {
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
        setData(null);
        setUserPhoto('');
      })
      .catch(err => {
        window.scrollTo(0, 0);
        setAlert({ alertType: 'danger', message: err.message });
      });
  };

  const handleDeleteOnClick = e => {
    setPhotoToBeDeleted(e.target.dataset.id);
  };

  return (
    <>
      <div
        className='edit-photo-cont'
        style={{ backgroundImage: `url(${bg})` }}
      >
        <h2 className='inner-h2'>Profilkép</h2>
        <div className='alert-cont'>
          {alert && (
            <p className={`alert alert-${alert.alertType}`}>{alert.message}</p>
          )}
        </div>
        <div className='inner'>
          <div className='user-photo-cont'>
            {userPhoto !== '' ? (
              <img src={userPhoto} alt='' />
            ) : (
              <img src={user} alt='' />
            )}
          </div>
          <p>
            <span>Helló </span>
            <span>{loggedInUser.firstName}</span>
            <span> !</span>
          </p>
          <p>
            Új profilképet töltenél fel vagy lecserélnéd a jelenlegit? Itt
            mindkettőt megteheted.
          </p>

          <div className='mb-3'>
            <input
              className='form-control inputfile'
              name='image'
              type='file'
              id='file'
              accept='/image/*'
              onChange={handleChange}
            />
            <label className='input-label' htmlFor='file'>
              Válassz egy fájlt (Kattints ide)
            </label>
          </div>
          <div className='text-center'>
            <button className='photo-btn' onClick={handleSubmit}>
              Küldés
            </button>
          </div>
          {userPhoto !== '' && (
            <>
              <p>Törölnéd a fotódat? Csak kattints az X-re.</p>
              <button
                className='del-btn'
                type='button'
                data-id={userPhoto}
                onClick={handleDeleteOnClick}
                data-bs-target='#myModal'
                data-bs-toggle='modal'
              >
                X
              </button>
            </>
          )}
        </div>
      </div>
      <DeleteModal
        handleDeleteConfirm={handleDeleteConfirm}
        deleteModalRef={deleteModalRef}
        type='EditPhoto'
      />
    </>
  );
};

export default EditPhoto;
