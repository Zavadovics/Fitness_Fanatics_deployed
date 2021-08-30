export const validateField = (
  fieldName,
  formData,
  setFormErrors,
  validators,
  references,
  formErrorTypes
) => {
  const value = formData[fieldName];
  let isValid = true;
  setFormErrors(prev => ({
    ...prev,
    [fieldName]: '',
  }));

  if (validators[fieldName] !== undefined) {
    for (const [validationType, validatorFn] of Object.entries(
      validators[fieldName]
    )) {
      if (isValid) {
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

export const isFormValid = (
  formData,
  setFormErrors,
  validators,
  references,
  formErrorTypes
) => {
  let isValid = true;
  for (const fieldName of Object.keys(formData)) {
    const isFieldValid = validateField(
      fieldName,
      formData,
      setFormErrors,
      validators,
      references,
      formErrorTypes
    );
    if (!isFieldValid) {
      isValid = false;
    }
  }
  return isValid;
};

export const handleInputChange = (e, formData, setFormData) => {
  const { name, value } = e.target;

  e.target.setCustomValidity('');

  setFormData({
    ...formData,
    [name]: value,
  });
};

export const onTickChange = setVerified => {
  setVerified(true);
};

export const handleInputBlur = (
  e,
  formData,
  setFormErrors,
  validators,
  references,
  formErrorTypes
) => {
  const { name } = e.target;
  validateField(
    name,
    formData,
    setFormErrors,
    validators,
    references,
    formErrorTypes
  );
};
