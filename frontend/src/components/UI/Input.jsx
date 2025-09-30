import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  label,
  ...props
}) => {
  const inputClasses = [
    'input',
    error && 'input-error',
    disabled && 'input-disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <span className="input-error-message">{error}</span>
      )}
    </div>
  );
};

export default Input;