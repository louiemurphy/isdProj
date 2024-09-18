import React, { useState, useEffect } from 'react';
import './RequesterDashboard.css'; // Custom CSS file for styling
import { FaUsers, FaShoppingCart, FaBox } from 'react-icons/fa'; // Icons for cards

function RequesterDashboard() {
  // States
  const [showRequestForm, setShowRequestForm] = useState(false); // Toggle form visibility
  const [requests, setRequests] = useState([]); // State to store requests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedRequest, setSelectedRequest] = useState(null); // State for selected request

  const [requestForm, setRequestForm] = useState({
    email: '',
    name: '',
    typeOfClient: '',
    classification: '',
    projectTitle: '',
    philgepsReferenceNumber: '',
    productType: '',
    requestType: '',
    dateNeeded: '',
    specialInstructions: '',
    files: null,
  });

  const [errors, setErrors] = useState({}); // To store form errors

  // Fetch all requests when the component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch requests from the backend
  const fetchRequests = async () => {
    try {
      setLoading(true); // Set loading state
      const response = await fetch('http://localhost:5000/api/requests');
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      setRequests(data); // Set fetched requests in the state
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setError(error.message); // Set error if there's a problem with the fetch
      setLoading(false); // Stop loading on error
    }
  };

  // Mock data for dropdowns
  const names = ['Cerael Donggay', 'Andrew Donggay', 'Aries Paye', ]; // truncated for brevity
  const productTypes = ['Solar Roof Top', 'Solar Lights', 'Solar Pump', ]; // truncated for brevity
  const requestTypes = ['Site Survey', 'Project Evaluation', 'Request for Quotation', ]; // truncated for brevity

  // Toggle between dashboard and form view
  const handleNewRequestClick = () => setShowRequestForm((prev) => !prev);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setRequestForm((prevForm) => ({ ...prevForm, files: e.target.files }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!requestForm.email) newErrors.email = 'This is a required question';
    if (!requestForm.name) newErrors.name = 'Please select your name';
    if (!requestForm.typeOfClient) newErrors.typeOfClient = 'Please select the type of client';
    if (!requestForm.classification) newErrors.classification = 'Please select the classification';
    if (!requestForm.projectTitle) newErrors.projectTitle = 'Please enter the project title';
    if (!requestForm.philgepsReferenceNumber) newErrors.philgepsReferenceNumber = 'Please enter the Philgeps reference number or NA';
    if (!requestForm.productType) newErrors.productType = 'Please select the product type';
    if (!requestForm.requestType) newErrors.requestType = 'Please choose your request type';
    if (!requestForm.dateNeeded) newErrors.dateNeeded = 'Please select a date needed';
    if (!requestForm.specialInstructions) newErrors.specialInstructions = 'This is a required question';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/api/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: requestForm.email,
            name: requestForm.name,
            typeOfClient: requestForm.typeOfClient,
            classification: requestForm.classification,
            projectTitle: requestForm.projectTitle,
            philgepsReferenceNumber: requestForm.philgepsReferenceNumber,
            productType: requestForm.productType,
            requestType: requestForm.requestType,
            dateNeeded: requestForm.dateNeeded,
            specialInstructions: requestForm.specialInstructions,
          }),
        });

        const newRequest = await response.json();
        setRequests((prevRequests) => [...prevRequests, newRequest]); // Add new request to the state

        // Reset form after submission
        setRequestForm({
          email: '',
          name: '',
          typeOfClient: '',
          classification: '',
          projectTitle: '',
          philgepsReferenceNumber: '',
          productType: '',
          requestType: '',
          dateNeeded: '',
          specialInstructions: '',
          files: null,
        });

        setShowRequestForm(false); // Switch back to dashboard view after submission
        setErrors({});
      } catch (error) {
        console.error('Error submitting the request:', error);
      }
    }
  };

  // Handle row click to show details
  const handleRowClick = (request) => {
    setSelectedRequest(request); // Set the selected request to be shown in the modal
  };

  // Close modal
  const closeModal = () => {
    setSelectedRequest(null); // Deselect the request
  };

  // Show loading state
  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  // Show error state if there is any error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`dashboard-container ${showRequestForm ? 'full-screen-form' : ''}`}>
      {!showRequestForm ? (
        <>
          <div className="sidebar">
            <div className="sidebar-header">
              <h2>Requester Dashboard</h2>
            </div>
            <ul className="sidebar-menu">
              <li>Dashboard</li>
              <li>Requests</li>
            </ul>
          </div>

          <div className="main-content">
            <div className="top-metrics">
              <div className="card">
                <FaUsers className="card-icon" />
                <h3>{requests.length}</h3>
                <p>Total Requests</p>
              </div>
              <div className="card">
                <FaShoppingCart className="card-icon" />
                <h3>{requests.filter(req => req.classification === 'Pending').length}</h3>
                <p>Pending Requests</p>
              </div>
              <div className="card">
                <FaBox className="card-icon" />
                <h3>{requests.filter(req => req.classification === 'Completed').length}</h3>
                <p>Completed Requests</p>
              </div>
            </div>

            <button className="create-request-btn" onClick={handleNewRequestClick}>
              {showRequestForm ? 'Cancel Request' : 'Create New Request'}
            </button>

            <div className="table-container">
              <h3>My Requests</h3>
              <table className="request-table">
                <thead>
                  <tr>
                    <th>REQID</th>
                    <th>TIMESTAMP</th>
                    <th>PROJECT TITLE</th>
                    <th>ASSIGNED TO</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} onClick={() => handleRowClick(request)}>
                      <td>{request.referenceNumber}</td>
                      <td>{request.timestamp}</td>
                      <td>{request.projectTitle}</td>
                      <td>{request.assignedTo || 'Unassigned'}</td>
                      <td>{request.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedRequest && (
  <div className="modal">
    <div className="modal-content">
      <h3 className="modal-header">Request Details</h3>
      <table className="modal-table">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{selectedRequest.id}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{selectedRequest.email}</td>
          </tr>
          <tr>
            <th>Name:</th>
            <td>{selectedRequest.name}</td>
          </tr>
          <tr>
            <th>Type of Client:</th>
            <td>{selectedRequest.typeOfClient}</td>
          </tr>
          <tr>
            <th>Classification:</th>
            <td>{selectedRequest.classification}</td>
          </tr>
          <tr>
            <th>Project Title:</th>
            <td>{selectedRequest.projectTitle}</td>
          </tr>
          <tr>
            <th>Philgeps Reference Number:</th>
            <td>{selectedRequest.philgepsReferenceNumber}</td>
          </tr>
          <tr>
            <th>Product Type:</th>
            <td>{selectedRequest.productType}</td>
          </tr>
          <tr>
            <th>Request Type:</th>
            <td>{selectedRequest.requestType}</td>
          </tr>
          <tr>
            <th>Date Needed:</th>
            <td>{selectedRequest.dateNeeded}</td>
          </tr>
          <tr>
            <th>Special Instructions:</th>
            <td>{selectedRequest.specialInstructions}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={closeModal} className="close-modal-btn">Close</button>
    </div>
  </div>
)}
        </>
      ) : (
        <section className="form-section">
          <h2>Create New Request</h2>
          <form onSubmit={handleSubmit} className="request-form">
            <div className="form-row">
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={requestForm.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>Your Name <span className="required">*</span></label>
                <select
                  name="name"
                  value={requestForm.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'input-error' : ''}
                >
                  <option value="">Select your name</option>
                  {names.map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                  ))}
                </select>
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type of Client <span className="required">*</span></label>
                <input
                  type="text"
                  name="typeOfClient"
                  value={requestForm.typeOfClient}
                  onChange={handleInputChange}
                  placeholder="Type of client"
                  className={errors.typeOfClient ? 'input-error' : ''}
                />
                {errors.typeOfClient && <p className="error-text">{errors.typeOfClient}</p>}
              </div>

              <div className="form-group">
                <label>Classification <span className="required">*</span></label>
                <select
                  name="classification"
                  value={requestForm.classification}
                  onChange={handleInputChange}
                  className={errors.classification ? 'input-error' : ''}
                >
                  <option value="">Select classification</option>
                  <option value="Negotiable">Negotiable</option>
                  <option value="Competitive">Competitive</option>
                </select>
                {errors.classification && <p className="error-text">{errors.classification}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Project Title <span className="required">*</span></label>
                <input
                  type="text"
                  name="projectTitle"
                  value={requestForm.projectTitle}
                  onChange={handleInputChange}
                  placeholder="Project title"
                  className={errors.projectTitle ? 'input-error' : ''}
                />
                {errors.projectTitle && <p className="error-text">{errors.projectTitle}</p>}
              </div>

              <div className="form-group">
                <label>Philgeps Reference Number <span className="required">*</span></label>
                <input
                  type="text"
                  name="philgepsReferenceNumber"
                  value={requestForm.philgepsReferenceNumber}
                  onChange={handleInputChange}
                  placeholder="Philgeps reference number or NA"
                  className={errors.philgepsReferenceNumber ? 'input-error' : ''}
                />
                {errors.philgepsReferenceNumber && <p className="error-text">{errors.philgepsReferenceNumber}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Product Type <span className="required">*</span></label>
                <select
                  name="productType"
                  value={requestForm.productType}
                  onChange={handleInputChange}
                  className={errors.productType ? 'input-error' : ''}
                >
                  <option value="">Select product type</option>
                  {productTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                {errors.productType && <p className="error-text">{errors.productType}</p>}
              </div>

              <div className="form-group">
                <label>Request Type <span className="required">*</span></label>
                <select
                  name="requestType"
                  value={requestForm.requestType}
                  onChange={handleInputChange}
                  className={errors.requestType ? 'input-error' : ''}
                >
                  <option value="">Select request type</option>
                  {requestTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                {errors.requestType && <p className="error-text">{errors.requestType}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date Needed <span className="required">*</span></label>
                <input
                  type="date"
                  name="dateNeeded"
                  value={requestForm.dateNeeded}
                  onChange={handleInputChange}
                  className={errors.dateNeeded ? 'input-error' : ''}
                />
                {errors.dateNeeded && <p className="error-text">{errors.dateNeeded}</p>}
              </div>

              <div className="form-group">
                <label>Special Instructions <span className="required">*</span></label>
                <textarea
                  name="specialInstructions"
                  value={requestForm.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Special instructions"
                  className={errors.specialInstructions ? 'input-error' : ''}
                />
                {errors.specialInstructions && <p className="error-text">{errors.specialInstructions}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Attach Files</label>
              <input
                type="file"
                name="files"
                onChange={handleFileChange}
                multiple
              />
            </div>
            <button type="submit" className="submit-btn">Submit Request</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default RequesterDashboard;
