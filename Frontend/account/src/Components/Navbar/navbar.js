import React from 'react';
import { useNavigate } from 'react-router-dom';
function Navbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Remove the token from localStorage or cookies
        localStorage.removeItem('token'); // Change to match your token storage
    
        // Redirect the user to the landing page
        navigate('/');
      };
    
  return (
    <div>
      <nav className="navbar bg-primary"> {/* Use bg-primary for blue background */}
        <div className="container-fluid">
          <a className="navbar-brand text-white">Database App</a> {/* Use text-white for white text */}
          <button className="btn btn-outline-light d-flex" type="button"onClick={handleLogout}> Logout</button> {/* Use btn-outline-light for white button */}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
