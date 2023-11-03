// import React from 'react';

// import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css';
// import LandingPage from './Components/LandingPage/LandingPage';
// import AdminPage from './Components/AdminPage/AdminPage';
// import UserPage from './Components/UserPage/UserPage';
// import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoutes'

// // Function to check if the user is authenticated (you can implement this as needed)
// const isAuthenticated = () => {
//   const token = localStorage.getItem('token'); // Check if the user has a valid token
//   return !!token; // Return true if the token exists
// };



// function App() {  
//   return (
//     <Router>
//       <Routes>
//       <Route path="/" element={<LandingPage />} />
//         <Route path="/AdminPage" element={<AdminPage />} />
//         <Route path="/UserPage" element={<UserPage />} />
        
        
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './Components/LandingPage/LandingPage';
import AdminPage from './Components/AdminPage/AdminPage';
import UserPage from './Components/UserPage/UserPage';
import Navbar from './Components/Navbar/navbar'

// Function to check if the user is authenticated (you can implement this as needed)
const isAuthenticated = () => {
  const token = localStorage.getItem('token'); // Check if the user has a valid token
  return !!token; // Return true if the token exists
};

// Custom ProtectedRoute component to protect routes
function ProtectedRoute({ element, path }) {
  if (isAuthenticated()) {
    return element;
  } else {
    // Redirect to the landing page if not authenticated
    return <Navigate to="/" />;
  }
}

function App() {
  return (
    <>
   
    <Router>
      <Routes>

        <Route path="/" element={ <><Navbar/> <LandingPage /></>} />
        <Route
          path="/AdminPage"
          element={<ProtectedRoute element={<><Navbar/><AdminPage /></>} path="/AdminPage" />}
        />
        <Route
          path="/UserPage"
          element={<ProtectedRoute element={<><Navbar/><UserPage /></>} path="/UserPage" />}
        />
      </Routes>
    </Router>
    </>
  );
}

export default App;
