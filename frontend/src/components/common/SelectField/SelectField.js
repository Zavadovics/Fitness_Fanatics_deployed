const SelectField = ({
  id,
  name,
  valueList,
  onChange,
  formvalue,
  reference,
  labelText,
  formError,
}) => {
  return (
    <div className={`${formError && 'was-validated'}`}>
      <label className='form-label m-2' htmlFor={name}>
        {labelText}
      </label>
      <select
        className='form-select m-2'
        name={name}
        onChange={onChange}
        formvalue={formvalue}
        ref={reference}
        id={id}
      >
        <option value={''}>Válassz!</option>
        {valueList.map(listValue => (
          <option key={listValue} value={listValue}>
            {listValue}
          </option>
        ))}
      </select>
      <div className='invalid-feedback mx-2'>{formError}</div>
    </div>
  );
};
export default SelectField;
