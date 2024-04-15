// SignIn.js

import React, { useState, useContext } from 'react';
import { Button, TextField, Typography, Container, CssBaseline, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import axios from 'axios';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie'; // Import Lottie library
import signInAnimation from '../signin.json'; // Replace with the actual path to your animation JSON file

const SignIn = () => {
  const { state, dispatch } = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'client', // Default to 'client'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/signin', formData, {
        withCredentials: true, // Include credentials (cookies)
      });
      const user = response.data.user;
      console.log(user);
      // Dispatch the user information to the context
      dispatch({ type: 'USER_INFO', payload: user });

      if (formData.userType === 'photographer') {
        navigate('/dashboard');
      } else {
        navigate('/photographerlist');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      // Handle error, show an error message to the user, etc.
    }
  };

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

  return (
    <div style={styles.appContainer}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={styles.container}>
        {/* Lottie Animation */}
        <div style={styles.animationContainer}>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: signInAnimation,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            height={200}
            width={200}
          />
        </div>

        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form style={styles.form} onSubmit={handleSubmit}>
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
          <FormControl component="fieldset" margin="normal">  
            <FormLabel component="legend">User Type</FormLabel>
            <RadioGroup
              aria-label="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="client" control={<Radio />} label="Client" />
              <FormControlLabel value="photographer" control={<Radio />} label="Photographer" />
            </RadioGroup>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign In
          </Button>
        </form>
      </div>
    </Container>
    </div>
  );
};

export default SignIn;
