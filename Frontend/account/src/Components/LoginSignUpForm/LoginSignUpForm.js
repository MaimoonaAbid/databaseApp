import PropTypes from 'prop-types';
import React, { useState } from 'react';

function LoginSignUpForm({ isSignUp, formData, onFormChange, onSubmit, emailError, loginError }) {
      const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const convertedValue = type === 'number' ? parseInt(value, 10) : value;
        onFormChange({
          ...formData,
          [name]: value,
          [name]: convertedValue,
        });
      };

    const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {isSignUp && (
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {emailError && <div className="error-messages">{emailError}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          title="Password must contain at least 8 characters, including at least one letter, one number, and one special character"
          required
        />
      </div>

      {loginError && <div className="error-messages">{loginError}</div>}

      {isSignUp && (
        <div className="mb-3">
          <label className="form-label">Role</label>
          <div>
            <label className="form-check-label">
              <input
                type="radio"
                className="form-check-input"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleInputChange}
              />{' '}
              Admin
            </label>
            <label className="form-check-label ms-3 ">
              <input
                type="radio"
                className="form-check-input"
                name="role"
                value="user"
                checked={formData.role === 'user'}
                onChange={handleInputChange}
              />{' '}
              User
            </label>
          </div>
        </div>
      )}

{formData.role === 'admin' && (
        <div className="mb-3">
          <label htmlFor="spaceneeded" className="form-label">
            Space Needed (MB)
          </label>
          <select
            className="form-control"
            id="spaceneeded"
            name="spaceneeded"
            value={formData.spaceneeded}
            onChange={handleInputChange}
            required
          >
            <option value="550">550MB</option>
            <option value="250">250MB</option>
            <option value="100">100MB</option>
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary" style={{ marginBottom: '30px' }}>
        {isSignUp ? 'Sign Up' : 'Login'}
      </button>
    </form>
  );
}

LoginSignUpForm.propTypes = {
  isSignUp: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  emailError: PropTypes.string,
  loginError: PropTypes.string,
};

export default LoginSignUpForm;
