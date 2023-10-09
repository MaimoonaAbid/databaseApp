
import { useNavigate } from 'react-router-dom';
import GoogleSignUpButton from '../GoogleSignUp/GoogleSignUpButton';
import React, { useState } from 'react';
import { register, login , verifyOTP } from '../../API_service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import OTPForm from '../OtpForm/OtpForm'; // Import the OTPForm component
//import { localStorage } from 'localStorage'; 

function LandingPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [showOTPForm, setShowOTPForm] = useState(false);

  // State for error messages
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    email: '',
    password: '',
    general: '', // Generic error message
  });

  const toggleForm = () => {
    setIsSignUp(!isSignUp); // Toggling between signup and login mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Reset error messages when input changes
    setErrorMessages({
      ...errorMessages,
      [name]: '',
      general: '', // Reset the generic error message
    });
  };

  const handleGoogleLoginSuccess = (user) => {
    
    navigate('/AdminPage');
    
    console.log("herr in success", user)
    // setFormData({
    //   name: user.profileObj.name,
    //   email: user.profileObj.email,
    // });
  };
  
  const handleGoogleLoginFailure = (error) => {

    console.log("failure: ", error)
    console.log('Google login failed:', error);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        formData.name = formData.username;
        const response = await register(formData);
        if (response.error) {
          if (response.error === 'A user with this email already exists'){
            setErrorMessages({
              ...errorMessages,
              email: 'A user with this email already exists.',
            });
          } else if (response.error === 'New user registration failed') {
            setErrorMessages({
              ...errorMessages,
              general: 'User registration failed. Please try again later.',
            });
          } 
          else {
            // Handle other registration errors
            setErrorMessages({
              ...errorMessages,
              general: 'Registration error. Please try again later.',
            });
          }
        } else{
          console.log(response)
          console.log('User registered successfully:', response.existingUser);
          setShowOTPForm(true);
          // Redirecting to the login page after registration
          setIsSignUp(false); // Switch to the login form
        }
        
      } else {
        // Handling login logic
        const response = await login(formData);
        console.log('Login response:', response); 
        if (response.userExists && response.userExists.role) {
          if (response.userExists.role === 'admin') {
            navigate('/AdminPage'); // Redirecting to adminpage
          } else {
            navigate('/UserPage'); // Redirecting to user user page
          }
        } else {
          // Handle login errors
          if (response.error === 'No user with this email exists') {
            setErrorMessages({
              ...errorMessages,
              email: 'User with this email does not exist.',
            });
          } else if (response.error === 'Incorrect password') {
            setErrorMessages({
              ...errorMessages,
              password: 'Incorrect password.',
            });
          } else {
            // Generic error message
            setErrorMessages({
              ...errorMessages,
              general: 'Login error. Please try again later.',
            });
          }
        }
      }
    } catch (error) {
      console.error('API request failed:', error);
      setErrorMessages({
        ...errorMessages,
        general: 'API request failed. Please try again later.', // Set a generic error message
      });
    }
  };
 // Callback function to handle OTP submission
 const handleOTPSubmission = async (otp) => {
  try {
    // Make an API request to verify the OTP
    const response = await verifyOTP({ email: formData.email, otp }); // Replace with your API call
    console.log('OTP verification response:', response);
    if (response.success) {
      // OTP is verified successfully
      setShowOTPForm(false); // Hide the OTP form
      setIsSignUp(false); // Switch to the login form
      console.log('OTP verification successfull');
    } else {
      // Handle OTP verification failure
      console.log('OTP verification failed');
      // You can display an error message or take other actions as needed
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    // Handle error
  }
};

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card no-card-border" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-6">
            <h1 style={{ color: 'blue', marginBottom: '30px' }}>
              {isSignUp ? 'Sign Up' : 'Login'}
            </h1>
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
                {/* Render email error message */}
                {errorMessages.email && <div className="error">{errorMessages.email}</div>}
                <div className="error">{errorMessages.email}</div>
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
                {/* Render password error message */}
                {errorMessages.password && <div className="error">{errorMessages.password}</div>}
                <div className="error">{errorMessages.password}</div>
              </div>

              {/* Render generic error message */}
              {errorMessages.general && <div className="error">{errorMessages.general}</div>}

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
              <GoogleSignUpButton onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
              <button type="submit" className="btn btn-primary">
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
            </form>
            <p>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={toggleForm}
                className="btn btn-link"
                style={{ color: 'blue' }}
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </p>
             {/* Render OTPForm conditionally */}
       {showOTPForm && (
        <OTPForm onSubmit={handleOTPSubmission} /> // Pass the callback function
      )}
          </div>
          <div className="col-md-6">
            <img
              src="https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-login_516790-1261.jpg"
              alt="Landing Page Image"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default LandingPage;


