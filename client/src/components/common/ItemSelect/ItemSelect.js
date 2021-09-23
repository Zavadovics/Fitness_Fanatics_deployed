const ItemSelect = ({
  id,
  name,
  valueList,
  onChange,
  formValue,
  reference,
  labelText,
  formError,
}) => {
  return (
    <div className={`${formError && 'was-validated'}`}>
      <label className={'form-label m-2'} htmlFor={name}>
        {labelText}
      </label>
      <select
        className={'form-select m-2'}
        name={name}
        onChange={onChange}
        value={formValue}
        ref={reference}
        id={name}
      >
        <option value={''}>Choose one!</option>
        {valueList.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <div className='invalid-feedback mx-2'>{formError}</div>
    </div>
  );
};
export default ItemSelect;
