// App.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Lottie from 'react-lottie';
import animationData from './profile.json';
import animationData1 from './services.json';
import './App.css'; // Import the CSS file with styles

const App = () => {
  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const animationOptions1 = {
    loop: true,
    autoplay: true,
    animationData: animationData1,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="app-container">
      {/* Stylish Banner */}
      <div className="banner-container">
        <div className="banner-text">
          <Typography variant="h3" component="h1" gutterBottom>
            SnapSolution
          </Typography>
       
        </div>
        <Typography variant="h5" className="banner-subtext">
          Empowering Your Photography Journey
        </Typography>
      </div>

    

      {/* Main Content */}
      <Container maxWidth="md" style={{ marginTop: '20px', flex: '1' }}>
        <Typography variant="body1" align="center" paragraph style={{ color: '#ddd' }}>
          Showcase your work, connect with clients, and grow your photography business with SnapSolution.
        </Typography>

        {/* Feature Cards */}
        <Grid container spacing={3}>
          {/* Create Your Profile Card */}
          <Grid item xs={12} sm={6}>
            <Card className="card-container">
              <Lottie options={animationOptions} height={200} width={200} />
              <CardContent>
                <Typography variant="h6" gutterBottom className="card-title">
                  Create Your Profile
                </Typography>
                <Typography className="card-description">
                  Build a stunning profile to showcase your portfolio, skills, and expertise.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* List Your Services Card */}
          <Grid item xs={12} sm={6}>
            <Card className="card-container">
              <Lottie options={animationOptions1} height={200} width={200} />
              <CardContent>
                <Typography variant="h6" gutterBottom className="card-title">
                  List Your Services
                </Typography>
                <Typography className="card-description">
                  Display your photography services, pricing, and availability for potential clients.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Typography variant="body1" align="center" style={{ margin: '40px 0', color: '#ddd' }}>
          Join SnapSolution today to unlock a world of opportunities in the photography industry. Whether you're a seasoned professional or just starting, SnapSolution is the perfect platform for you.
        </Typography>

        {/* Sign In Button */}
        <Button
          component={Link}
          to="/signin"
          variant="contained"
          color="primary"
          fullWidth
          style={{
            marginTop: '20px',
            background: 'linear-gradient(to right, #4caf50, #00796b)',
            transition: 'background 0.3s',
            '&:hover': {
              background: 'linear-gradient(to right, #00796b, #4caf50)',
            },
          }}
        >
          <span style={{ display: 'inline-block', transition: 'transform 0.3s' }}>Sign In</span>
        </Button>

        {/* Join Now Button */}
        <Button
          component={Link}
          to="/signup"
          variant="contained"
          color="secondary"
          fullWidth
          style={{
            marginTop: '20px',
            background: 'linear-gradient(to right, #ff4081, #e91e63)',
            transition: 'background 0.3s',
            '&:hover': {
              background: 'linear-gradient(to right, #e91e63, #ff4081)',
            },
          }}
        >
          <span style={{ display: 'inline-block', transition: 'transform 0.3s' }}>Join Now</span>
        </Button>
      </Container>
    </div>
  );
};

export default App;
