import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const PhotographersList = () => {
  const [photographersData, setPhotographersData] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const handleLogout = () => {
    axios.post('/logout')
      .then(() => {
        // Redirect to the homepage after successful logout
        navigate('/');
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };
  useEffect(() => {
    axios.get('/photographers')
      .then(response => {
        console.log(response.data)
        setPhotographersData(response.data);
      })
      .catch(error => {
        console.error('Error fetching photographers data:', error);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPhotographers = photographersData.filter((photographer) => {
    const achievements = photographer.achievements && photographer.achievements.toLowerCase();
    
    switch (filter.toLowerCase()) {
      case 'nature photography':
        return achievements.includes('nature photography');
      case 'portrait photography':
        return achievements.includes('portrait photography');
      case 'wedding photography':
        return achievements.includes('wedding photography');
      // Add more cases for additional filters
      default:
        return true; // Show all if no filter selected
    }
  });

  const styles = {
    appContainer: {
      background: 'linear-gradient(to bottom right, #3494e6, #ec6ead)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
    },
  };


  return (
    <div style={styles.appContainer}>
    <Container maxWidth="lg" style={{ marginTop: '80px' }}>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} style={{ marginBottom: '20px' }}>
        Back to Home
      </Button>
     
      <Typography variant="h4" gutterBottom>
        Photographers List
      </Typography>
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id="filter-label">Filter by Photography type</InputLabel>
        <Select
          labelId="filter-label"
          id="filter"
          value={filter}
          onChange={handleFilterChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Nature Photography">Nature Photography</MenuItem>
    <MenuItem value="Portrait Photography">Portrait Photography</MenuItem>
    <MenuItem value="Wedding Photography">Wedding Photography</MenuItem>
          {/* Add more filter options based on photographer achievements */}
        </Select>
      </FormControl>
      <Grid container spacing={3}>
        {filteredPhotographers.map((photographer) => (
          <Grid item xs={12} md={4} key={photographer._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                alt={`${photographer.firstName} ${photographer.lastName}`}
                src={photographer.profileImage} // Display the first photo as a preview
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {`${photographer.firstName} ${photographer.lastName}`}
                </Typography>
                <Typography>
                  {`${photographer.city}, ${photographer.state},${photographer.photographerType}`}
                </Typography>
                <Button
                  component={Link}
                  to={`/profile/${photographer._id}`} // Link to the photographer's full profile page
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: '10px' }}
                >
                  See More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
    </Container>
    </div>
  );
};

export default PhotographersList;
