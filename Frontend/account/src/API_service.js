import axios from 'axios'
const baseUrl = 'http://localhost:3001/api'; // this is base url of the backend API


//funtion for registring a new user
export const register = async (userData)=>{
    try 
    {
        const response = await axios.post( `${baseUrl}/user/register`, userData)
        console.log("API Response",response);
        return response.data
     }
    catch(error)
    {
        throw error
    }    
};

// Funtion for user login

export const login = async (userData) =>
{
    try{
       const  response = await axios.post(`${baseUrl}/user/login`, userData)
       console.log(response)
       return response.data;
    }
    catch(error)
    {
        throw error;
    }
};

  // Function to verify OTP
export const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post(`${baseUrl}/user/verifyOTP`, email, otp );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  //function to add a car
  export const addCar = async (adminId, carData) => {
    try {
      const response = await axios.post(`${baseUrl}/add-car`, { adminId, carData });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

