import React from 'react';
import './Input.css';

const Input = ({ 
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`input-container ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input ${error ? 'input--error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="input-error">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="input-helper">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;






