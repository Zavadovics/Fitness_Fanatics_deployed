import React from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import './inputField.scss';

const InputField = ({
  type,
  name,
  value,
  onChange,
  onBlur,
  reference,
  error,
  labelText,
  placeholder,
  centerClass,
  passwordShown,
  setPasswordShown,
}) => {
  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  let inputField;
  if (
    name === 'password' ||
    name === 'confirmPassword' ||
    name === 'newPassword'
  ) {
    inputField = (
      <div className={`${error && 'was-validated'} password-eye-cont`}>
        <label className={`form-label m-2 ${centerClass}`} htmlFor={name}>
          {labelText}
        </label>
        <input
          placeholder={placeholder}
          className={`form-control m-2 ${centerClass}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={reference}
        />
        {passwordShown ? (
          <BsEye onClick={togglePasswordVisibility} className='password-icon' />
        ) : (
          <BsEyeSlash
            onClick={togglePasswordVisibility}
            className='password-icon'
          />
        )}
        <div className={`invalid-feedback mx-2 password-eye-feedback`}>
          {error}
        </div>
      </div>
    );
  } else {
    inputField = (
      <div className={`${error && 'was-validated'}`}>
        <label className={`form-label m-2 ${centerClass}`} htmlFor={name}>
          {labelText}
        </label>
        <input
          placeholder={placeholder}
          className={`form-control m-2 ${centerClass}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={reference}
        />
        <div className={`invalid-feedback mx-2 ${centerClass}`}>{error}</div>
      </div>
    );
  }

  return <>{inputField}</>;
};

export default InputField;
