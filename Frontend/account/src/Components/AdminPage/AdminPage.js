import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css'; // Import the CSS for AdminPage
import CarForm from '../Car/CarForm';

function AdminPage() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card no-card-border" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-6">
          <h1 style={{ color: 'blue', fontWeight: 'bold', marginBottom: '30px' }}>
                  Database Created
                </h1>
                <CarForm />
          
          </div>
          <div className="col-md-6">
            {/* Add an image or other content here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

