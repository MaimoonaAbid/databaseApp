
import { useNavigate } from 'react-router-dom';
import GoogleSignUpButton from '../GoogleSignUp/GoogleSignUpButton';
import React, { useState } from 'react';
import { register, login , verifyOTP } from '../../API_service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import axios from 'axios';
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
  // const [loginError, setLoginError] = useState({
  //   emailError: "",
  //   passwordError: "",
  // })

  const [emailError, setEmailError] = useState('')
  const [loginError, setLoginError] = useState('');
  // const [LoginemailError, setLoginEmailError] = useState('')
  // const [passwordError, setPasswordError] = useState('')


  // State for error messages
  const [errorMessages, setErrorMessages] = useState([]);
 
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
      console.log("before", isSignUp);
      if (isSignUp) {
        formData.name = formData.username;
        // const response = await register(formData);
        console.log("before api call")
        const response = await axios.post( `http://localhost:3001/api/user/register`, formData)
        console.log("resp", response);
        if (response && response.data)
         {
          if (response.data.error === 'A user with this email already exists')
          {
            console.log("inside if user email");
            setEmailError("A user with this email already exists")
          } 
          else{
            console.log("else", response)
            console.log('User registered successfully:', response.existingUser);
            setShowOTPForm(true);
            // Redirecting to the login page after registration
            setIsSignUp(false); // Switch to the login form
          }
        }
         
      } 
      else{
        //Handling login logic
         console.log('Login response:');
         try {
          //const response = await login(formData);
          console.log("Inside login try block") 
         const  response = await axios.post(`http://localhost:3001/api/user/login`, formData)
         console.log(response)
          if (response && response.data) {
            console.log("inside if", response.data.error)  
            if (response.data.error === 'User email or password is wrong')
            {
              console.log("inside if user login");
              setLoginError("User email or password is wrong")
            }
            else if (response.data.userExists && response.data.userExists.role){
         // Login was successful, redirect based on user role
         if (response.data.userExists.role === 'admin') {
        navigate('/AdminPage');
         } else {
         navigate('/UserPage');
         }
            }
            else {
              // Handle any other cases here or show a generic error
              setErrorMessages(['Login failed.']);
            }
            
          }
           
        } catch (error) {
          console.error('API request failed:', error);
        }
      }
      // else {
      //   // Handling login logic
      //   console.log('Login response:'); 
      //   try {
      //     const  response = await login(formData);
      //    //const  response = await axios.post(`http://localhost:3001/api/user/login`, formData)
      //     console.log('login response', response);
          
      //   } catch (error) {
      //      console.log("error. error", error);
      //   }
      //   const response = await login(formData)
      //   if (response.userExists) {
      //     if (response.userExists.role === 'admin') {
      //       navigate('/AdminPage'); // Redirecting to adminpage
      //     } else {
      //       navigate('/UserPage'); // Redirecting to user user page
      //     }
      //   } else {
      //     // Handle login errors
        
      //     console.log("login error");
      //     if (response.error === 'No user with this email exists') {
      //       console.log("if login error", response)
      //       setLoginEmailError("User with this email does not exist.")
      //       //setErrorMessages(['User with this email does not exist.']);
      //     } else if (response.error === 'Incorrect password') {
      //       setPasswordError("Incorrect password")
      //       //setErrorMessages(['Incorrect password.']);
      //     } else {
      //       // Generic error message
      //       setErrorMessages(['Login error. Please try again later.']);
      //     }
      //   }
      // }
    } 
    catch (error) {
      console.error('API request failed:', error);
      setErrorMessages(['API request failed. Please try again later.']);
    }
  };
 // Callback function to handle OTP submission
 const handleOTPSubmission = async (otp) => {
  const newErrorMessages = []; 
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
      newErrorMessages.push('OTP verification failed');
      // You can display an error message or take other actions as needed
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    newErrorMessages.push('OTP verification error.');
  }
  setErrorMessages(newErrorMessages);
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
                 {emailError && <div className="error-messages">{emailError}</div>}
                {/* <div className='error-messages'> {emailError}</div> */}
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


