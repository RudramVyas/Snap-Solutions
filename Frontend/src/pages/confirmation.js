// Install Material-UI by running: npm install @mui/material @emotion/react @emotion/styled

import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Input,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AWS from 'aws-sdk';
import { useNavigate  } from 'react-router-dom';

const ConfirmationPage = () => {
  
  const navigate=useNavigate();
  const location = useLocation(); 
  const { pathname } = location;

  const [profileImage, setProfileImage] = useState(null);
  const [age, setAge] = useState('');
  const [cameraMode, setCameraMode] = useState('');
  const [photoType, setPhotoType] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [achievements, setAchievements] = useState('');
  const [gallery, setGallery] = useState([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [photographerType, setPhotographerType] = useState('');

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setProfileImage(image);
  };

  const handleGalleryChange = (e) => {
    const images = e.target.files;
    setGallery([...gallery, ...images]);
  };
    // Configure AWS SDK
AWS.config.update({
  accessKeyId: 'AKIA3HJDY7BVT65DBTF5',
  secretAccessKey: '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',
  region: 'us-east-1',
});


const s3 = new AWS.S3();

const uploadToS3 = async (file, folder) => {
  const params = {
    Bucket: 'reserchreviewnetwork',
    Key: `${folder}/${file.name}`,
    Body: file,
    ACL: 'public-read', // Set the appropriate ACL
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
  const handleSubmit = async () => {
    console.log(pathname)
    const [, , , id, otp] = pathname.split('/');
    console.log(id)

    try {
      const profileImageUrl = profileImage ? await uploadToS3(profileImage, 'profiles') : null;
      const galleryImageUrls = await Promise.all(gallery.map((image) => image ? uploadToS3(image, 'gallery') : null));
      
      const requestData = {
        id,
        otp,
        age,
        cameraMode,
        photoType, // Assuming you have a photoType state, if not, you may need to add it
        phoneNo,
        achievements,
        city,
        state,
        photographerType,
        profileImageUrl,
        galleryImageUrls,
      };
      console.log(requestData)
      axios.post('/confirmation', requestData)
        .then(response => {
          navigate("/signin");
        })
        .catch(error => {
          console.error('Error sending image URLs:', error);
        });
    } catch (error) {
      console.error('Error processing image uploads:', error);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {profileImage ? (
          <Avatar
            src={URL.createObjectURL(profileImage)}
            sx={{ width: 100, height: 100 }}
          />
        ) : (
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* You can set a default avatar here */}
          </Avatar>
        )}
        <Typography component="h1" variant="h5">
          Personal Data
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-image"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="profile-image">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="photographer-type-label">Photographer Type</InputLabel>
              <Select
                labelId="photographer-type-label"
                id="photographer-type"
                value={photographerType}
                onChange={(e) => setPhotographerType(e.target.value)}
                label="Photographer Type"
              >
                <MenuItem value="portrait">Portrait</MenuItem>
                <MenuItem value="landscape">Landscape</MenuItem>
                {/* Add more photographer types as needed */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="camera-mode-label">Camera Mode</InputLabel>
              <Select
                labelId="camera-mode-label"
                id="camera-mode"
                value={cameraMode}
                onChange={(e) => setCameraMode(e.target.value)}
                label="Camera Mode"
              >
                <MenuItem value="automatic">Automatic</MenuItem>
                <MenuItem value="manual">Manual</MenuItem>
                <MenuItem value="dslr">DSLR</MenuItem>
                {/* Add more camera modes as needed */}
              </Select>
            </FormControl>
          </Grid>
            {/* Add more fields as needed */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Phone Number"
                type="tel"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                label="Achievements"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
              />
            </Grid>
          </Grid>
          <Typography style={{ marginTop: 20 }} variant="h6" gutterBottom>
            Photo Gallery
          </Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="gallery-images"
            type="file"
            multiple
            onChange={handleGalleryChange}
          />
          <label htmlFor="gallery-images">
            <Button variant="outlined" color="primary" component="span">
              Add Photos
            </Button>
          </label>
          <div style={{ marginTop: 10 }}>
            {gallery.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`gallery-${index}`}
                style={{ width: 100, height: 100, marginRight: 10, marginBottom: 10 }}
              />
            ))}
          </div>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: 20 }}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ConfirmationPage;
