import logo from '../../../images/runner.png';

const DeleteModal = ({ handleDeleteConfirm, deleteModalRef, type }) => {
  return (
    <div className='py-2'>
      <div className='modal' tabIndex='-1' id='myModal' ref={deleteModalRef}>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              {type === 'EditPhoto' ? (
                <h5 className='modal-title'>
                  <img
                    className='modal-logo'
                    style={{ width: '1.5em' }}
                    src={logo}
                    alt='logo'
                  />{' '}
                  FITNESS FANATICS - Profilkép
                </h5>
              ) : (
                <h5 className='modal-title'>
                  <img
                    className='modal-logo'
                    style={{ width: '1.5em' }}
                    src={logo}
                    alt='logo'
                  />{' '}
                  FITNESS FANATICS - Tevékenységek
                </h5>
              )}
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              {type === 'EditPhoto' ? (
                <p>Biztosan törölni szeretnéd ezt a fotót?</p>
              ) : (
                <p>Biztosan törölni szeretnéd ezt a tevékenységet?</p>
              )}
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Mégsem
              </button>
              <button
                type='button'
                className='btn btn-danger'
                data-bs-dismiss='modal'
                onClick={handleDeleteConfirm}
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
