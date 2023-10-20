
import { useNavigate } from 'react-router-dom';
import GoogleSignUpButton from '../GoogleSignUp/GoogleSignUpButton';
import React, { useState } from 'react';
import { register, login , verifyOTP } from '../../API_service';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import axios from 'axios';
import OTPForm from '../OtpForm/OtpForm'; // Import the OTPForm component
import LoginSignUpForm from '../LoginSignUpForm/LoginSignUpForm'; // Import the new component

function LandingPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [emailError, setEmailError] = useState('')
  const [loginError, setLoginError] = useState('');
  // State for error messages
  const [errorMessages, setErrorMessages] = useState([]);
  const [formData, setFormData] = useState({
    // Initialize with default values if needed
    username: '',
    email: '',
    password: '',
    role: 'user',
    spaceneeded: '',

});
  const toggleForm = () => {
    setIsSignUp(!isSignUp); // Toggling between signup and login mode
  };

  const handleGoogleLoginSuccess = (user) => {
    
    navigate('/AdminPage');
    
    console.log("Google Login success", user)
  };
  
  const handleGoogleLoginFailure = (error) => {

    console.log("failure: ", error)
    console.log('Google login failed:', error);
  };
  const handleSubmit = async (formData) => {
   // formData.preventDefault();
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
            <LoginSignUpForm
             isSignUp={isSignUp}
             formData={formData}
             onFormChange={setFormData}
             onSubmit={handleSubmit}
             emailError={emailError}
             loginError={loginError}
            />
            <GoogleSignUpButton onSuccess={handleGoogleLoginSuccess} onFailure={handleGoogleLoginFailure} />
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
        <OTPForm 
        onSubmit={handleOTPSubmission} 
        //formData={formData} // Pass formData to OTPForm
        /> 
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


