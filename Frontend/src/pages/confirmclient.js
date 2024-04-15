import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams ,useNavigate} from 'react-router-dom';

const ConfirmClient = () => {
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const { id,otp } = useParams();
  const navigate = useNavigate ();
  useEffect(() => {
    // Make Axios call for email confirmation
    axios.post('/connfirmclient', { id, otp })
      .then(response => {
        // Assuming your confirmation API returns a success message
        setConfirmationMessage(response.data.message);

        // Redirect to sign-in page after a successful confirmation
        setTimeout(() => {
          navigate('/signin');
        }, 3000); // Redirect after 3 seconds (adjust as needed)
      })
      .catch(error => {
        // Handle confirmation error
        console.error('Confirmation error:', error);
        setConfirmationMessage('Email confirmation failed. Please try again.');
      });
  }, []);

  return (
    <div>
      <h2>Email Confirmation</h2>
      {confirmationMessage && <p>{confirmationMessage}</p>}
    </div>
  );
};

export default ConfirmClient;
