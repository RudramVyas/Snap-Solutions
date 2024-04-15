import React, { useState, useEffect,useContext } from 'react';
import { Container, Grid, Paper, Typography, Button, AppBar, Toolbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams,useNavigate  } from 'react-router-dom';
import axios from 'axios';
import '../css/profile.css'; // Import a CSS file for custom styles
import { Context } from '../context';


const Profile = ({  }) => {
  const { state, dispatch } = useContext(Context);
  const [photographerData, setPhotographerData] = useState(null);
  const { id } = useParams();
  const navigate  = useNavigate();

  useEffect(() => {
    
    // Fetch photographer data from the server
    axios.get(`/photographers/${id}`)
      .then(response => {
        console.log(response.data);
        setPhotographerData(response.data);
      })
      .catch(error => {
        console.error('Error fetching photographer data:', error);
      });
  }, []);

  if (!photographerData) {
    // Loading state or handle error
    return null;
  }

  const {
    firstName,
    lastName,
    city,
    photographerType,
    phone,
    achievements,
    photos,
    cameraMode,
    profileImage
  } = photographerData;
  const handleStartChat = () => {
    // Navigate to the Chat component with the sender and receiver information
    navigate(`/chat`, {
      state: {
        senderId: state.user["_id"],
        senderName: state.user.firstName,
        receiverId: id,
        receiverName: firstName,
      },
    });
  };
  return (
    <div className="app-container">
      <AppBar position="fixed" color="primary" className="app-bar">
        <Toolbar>
          <IconButton color="inherit" onClick={() => window.history.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className="app-title">
            {`${firstName} ${lastName}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: '80px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className="profile-paper">
              <div className="profile-header">
                <img src={profileImage} alt="Photographer" className="profile-picture" />
                <Typography variant="h4" className="profile-name">
                  {`${firstName} ${lastName}`}
                </Typography>
              </div>
              <div className="profile-details">
                <Typography variant="body1" className="profile-info">
                  <span className="info-label">City:</span> {city}
                </Typography>
              
                <Typography variant="body1" className="profile-info">
                  <span className="info-label">Mode:</span> {cameraMode}
                </Typography>
                <Typography variant="body1" className="profile-info">
                  <span className="info-label">Type:</span> {photographerType}
                </Typography>
                <Typography variant="body1" className="profile-info">
                  <span className="info-label">Phone No:</span> {phone}
                </Typography>
                <Typography variant="body1" className="profile-info">
                  <span className="info-label">Photpgraphy type:</span> {achievements}
                </Typography>
              </div>
              <Button variant="contained" color="primary" className="contact-button" onClick={handleStartChat}>
                Contact
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {photos.map((photo, index) => (
                <Grid item xs={6} key={index} className="photo-grid-item">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="photo-image"
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Profile;
