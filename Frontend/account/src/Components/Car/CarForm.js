// CarForm.js

import React, { useState } from 'react';
function CarForm() {
  const initialCarData = {
    carName: '',
    carCC: '',
    carModel: '',
  };

  const [carData, setCarData] = useState(initialCarData);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setCarData({
      ...carData,
      [fieldName]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle the car form submission here

    // Reset the form data after submission
    setCarData(initialCarData);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h3 style={{ color: 'blue', fontWeight: 'bold', marginBottom: '30px', marginTop:'30px' }}>
            Enter Car Details
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="carName" className="form-label">
                Car Name
              </label>
              <input
                type="text"
                className="form-control"
                id="carName"
                name="carName"
                value={carData.carName}
                onChange={(e) => handleInputChange(e, 'carName')}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="carCC" className="form-label">
                Car CC
              </label>
              <input
                type="text"
                className="form-control"
                id="carCC"
                name="carCC"
                value={carData.carCC}
                onChange={(e) => handleInputChange(e, 'carCC')}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="carModel" className="form-label">
                Car Model
              </label>
              <input
                type="text"
                className="form-control"
                id="carModel"
                name="carModel"
                value={carData.carModel}
                onChange={(e) => handleInputChange(e, 'carModel')}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CarForm;
