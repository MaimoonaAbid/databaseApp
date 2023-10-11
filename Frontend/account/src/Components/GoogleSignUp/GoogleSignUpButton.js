
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleSignUpButton = ({ onSuccess, onFailure }) => {


  // console.log("iddd",process.env.REACT_APP_GOOGLE_CLIENT_ID)
  return (
    <GoogleOAuthProvider clientId="1021093502457-88v72e5ui20p7vucefsld63m20ku184q.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={onSuccess} // Use the passed-in onSuccess function
        onFailure={onFailure} // Use the passed-in onFailure function
      >
        Sign up with Google
      </GoogleLogin>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignUpButton;
