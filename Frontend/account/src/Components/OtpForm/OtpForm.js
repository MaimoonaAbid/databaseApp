
import React, { useState } from 'react';

const OTPForm = ({ onSubmit, formData}) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the onSubmit callback function with the entered OTP
    onSubmit(otp, formData);
  };

  return (
    <div className="col-md-6">
      <h1 style={{ color: 'blue', marginBottom: '30px' }}>Enter OTP</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="otp" className="form-label">
            OTP
          </label>
          <input
            type="text"
            className="form-control"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit OTP
        </button>
      </form>
    </div>
  );
};

export default OTPForm;
