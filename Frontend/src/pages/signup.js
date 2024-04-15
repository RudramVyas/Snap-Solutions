import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'react-lottie';
import animationData from '../signup.json'; // Replace with your animation data

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'client', // Default value for the radio field
  });
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const styles = {
    appContainer: {
      background: 'linear-gradient(to bottom right, #3494e6, #ec6ead)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '50px',
      background: 'white', // Add this line
      padding: '20px', // Add this line for better readability
      borderRadius: '10px', 
    },
    form: {
      width: '100%',
      marginTop: '20px',
    },
    animationContainer: {
      marginBottom: '20px',
    },
  };
  const handleSnackbarClose = () => {
    setOpenSuccess(false);
    setOpenError(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/signup', formData);
      console.log('User registered successfully:', response.data);
      navigate('/signin');
      setOpenSuccess(true);
    } catch (error) {
      console.error('Error registering user:', error.message);
      setErrorMessage(error.message);
      setOpenError(true);
    }
  };

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={styles.appContainer}>
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',backgroundColor:'white' }}>
      <CssBaseline />
      <div style={styles.container}>
      <div sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Lottie options={animationOptions} height={120} width={120} sx={{ marginBottom: 2 }} />
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} style={styles.form} >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Radio field for user type selection */}
          <RadioGroup
            aria-label="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            sx={{ flexDirection: 'row', marginTop: 2 }}
          >
            <FormControlLabel value="client" control={<Radio />} label="Client" />
            <FormControlLabel value="photographer" control={<Radio />} label="Photographer" />
          </RadioGroup>

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Sign Up
          </Button>
        </form>
      </div>

      {/* Snackbar for displaying success message */}
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          User registered successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for displaying error message */}
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      </div>
    </Container>
    </div>
  );
};

export default SignUp;
