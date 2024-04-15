import React, { useContext, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Context } from '../context'; // Import your context
import AWS from 'aws-sdk';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { state, dispatch } = useContext(Context);
  const user = state.user;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [photoPreviews, setPhotoPreviews] = useState([...user.photos]);
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
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
    setProfileImagePreview(null);
    setPhotoPreviews([...user.photos]);
  };

  const handleSaveEdit = async () => {
    try {
      // Upload new profile image to S3 if it exists
      console.log(editedUser.profileImage);

      const newProfileImageUrl = editedUser.profileImage && editedUser.profileImage.name
        ? await uploadToS3(editedUser.profileImage, 'profiles')
        : null;
      
      console.log(newProfileImageUrl);
      
      // Upload updated photo gallery images to S3
      console.log( editedUser.photos)
      const newPhotoGalleryUrls = await Promise.all(
        editedUser.photos.map(( photo) => (photo && photo.name ? uploadToS3(photo, 'gallery') : photo))
      );
      
      // Prepare updated user data
      const updatedUserData = {
        ...user,
        ...editedUser,
        profileImage: newProfileImageUrl || user.profileImage,
        photos: newPhotoGalleryUrls.filter(Boolean), // Filter out null values
      };
      console.log(updatedUserData)
      // Send updated user data to Express Node API using axios
      await axios.post('/updateUser', updatedUserData);
  
      // Update local state with the new data
      dispatch({ type: 'UPDATE_USER', payload: updatedUserData });
  
      // Reset editing state
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };
  

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        setEditedUser((prevUser) => ({ ...prevUser, profileImage: file }));
      };
  
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (user cancels), set profileImage to null
      setProfileImagePreview(null);
      setEditedUser((prevUser) => ({ ...prevUser, profileImage: null }));
    }
  };
  
  
  const handlePhotoChange = (e, index) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const updatedPreviews = [...photoPreviews];
        updatedPreviews[index] = reader.result;
  
        setPhotoPreviews(updatedPreviews);
        setEditedUser((prevUser) => {
          const updatedPhotos = [...prevUser.photos];
          updatedPhotos[index] = file;
          return { ...prevUser, photos: updatedPhotos };
        });
      };
  
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (user cancels), set the corresponding photo to null
      const updatedPreviews = [...photoPreviews];
      updatedPreviews[index] = null;
  
      setPhotoPreviews(updatedPreviews);
      setEditedUser((prevUser) => {
        const updatedPhotos = [...prevUser.photos];
        updatedPhotos[index] = null;
        return { ...prevUser, photos: updatedPhotos };
      });
    }
  };
  
  

  const handleDeletePhoto = (index) => {
    const userCancelled = window.confirm('Are you sure you want to delete this photo?');
  
    if (!userCancelled) {
      return; // User cancelled deletion, do nothing
    }
  
    const updatedPreviews = [...photoPreviews];
    updatedPreviews.splice(index, 1);
  
    setPhotoPreviews(updatedPreviews);
    
    setEditedUser((prevUser) => {
      const updatedPhotos = [...prevUser.photos];
      
      if (index < updatedPhotos.length) {
        // If the index is within the bounds, set the corresponding photo to null
        updatedPhotos[index] = null;
      }
  
      return { ...prevUser, photos: updatedPhotos };
    });
  };
  

  const handleAddNewPhoto = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setPhotoPreviews((prevPreviews) => [...prevPreviews, reader.result]);
        setEditedUser((prevUser) => ({ ...prevUser, photos: [...prevUser.photos, file] }));
      };
  
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (user cancels), do nothing
    }
  };
  

  if (!user) {
    // Handle the case where user data is not available
    return (
      <Container component="main" maxWidth="md">
        User data not available
      </Container>
    );
  }

  const {
    firstName,
    lastName,
    achievements,
    phone,
    profileImage,
    photos,
  } = isEditing ? editedUser : user;

  return (
    <div className="app-container" style={{ background: 'linear-gradient(to bottom right, #3494e6, #ec6ead)', minHeight: '100vh', padding: '20px' }}>
      <AppBar position="fixed" color="primary" className="app-bar">
        <Toolbar>
          <IconButton color="inherit" onClick={() => window.history.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className="app-title" style={{ flex: 1, marginLeft: '10px', color: '#fff' }}>
            {`${editedUser.firstName} ${editedUser.lastName}'s Dashboard`}
          </Typography>
          {!isEditing && (
            <Button color="inherit" onClick={() => setIsEditing(true)} style={{ color: '#fff' }}>
              Edit
            </Button>
          )}
          {isEditing && (
            <>
              <Button color="inherit" onClick={handleSaveEdit} style={{ color: '#fff' }}>
                Save
              </Button>
              <Button color="inherit" onClick={handleCancelEdit} style={{ color: '#fff' }}>
                Cancel
              </Button>
            </>
          ) }
           <Button color="inherit" onClick={() => navigate('/signin')} style={{ color: '#fff' }}>
               
                Logout
              </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: '80px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className="profile-paper" style={{ padding: '20px' }}>
              <div className="profile-header" style={{ textAlign: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  id="profile-image-input"
                  style={{ display: 'none' }}
                  onChange={handleProfileImageChange}
                />
                <label htmlFor="profile-image-input">
                  <Avatar
                    alt={`${editedUser.firstName} ${editedUser.lastName}`}
                    src={profileImagePreview || editedUser.profileImage}
                    className="profile-picture"
                    style={{ width: '150px', height: '150px', border: '4px solid #000' }}
                  />
                </label>
                <Typography variant="h4" className="profile-name" style={{ marginTop: '10px', color: '#333' }}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="First Name"
                      value={editedUser.firstName}
                      onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                      style={{ marginBottom: '10px' }}
                    />
                  ) : (
                    `${editedUser.firstName} ${editedUser.lastName}`
                  )}
                </Typography>
              </div>
              <div className="profile-details" style={{ marginTop: '20px' }}>
                <Typography variant="body1" className="profile-info" style={{ color: '#555' }}>
                  <span className="info-label">Phone:</span>{' '}
                  {isEditing ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                    
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    />
                  ) : (
                    editedUser.phone
                  )}
                </Typography>
                <Typography variant="body1" className="profile-info" style={{ color: '#555' }}>
                  <span className="info-label">Achievements:</span>{' '}
                  {isEditing ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={editedUser.achievements}
                      onChange={(e) => setEditedUser({ ...editedUser, achievements: e.target.value })}
                    />
                  ) : (
                    editedUser.achievements
                  )}
                </Typography>
              </div>
            
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className="profile-paper" style={{ padding: '20px', background: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <div className="photo-gallery">
                <Typography variant="h6" gutterBottom style={{ color: '#333' }}>
                  Photo Gallery
                </Typography>
                <Grid container spacing={2}>
                  {photoPreviews.map((photo, index) => (
                    <Grid item xs={4} key={index} className="photo-grid-item">
                      <input
                        type="file"
                        accept="image/*"
                        id={`photo-input-${index}`}
                        style={{ display: 'none' }}
                        onChange={(e) => handlePhotoChange(e, index)}
                      />
                      <label htmlFor={`photo-input-${index}`}>
                        <img src={photo} alt={`Photo ${index + 1}`} className="photo-image" style={{ width: '100%', borderRadius: '8px' }} />
                      </label>
                      {isEditing && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleDeletePhoto(index)}
                          className="delete-button"
                          style={{ marginTop: '10px' }}
                        >
                          Delete
                        </Button>
                      )}
                    </Grid>
                  ))}
                  {isEditing && (
                    <Grid item xs={4} className="photo-grid-item">
                      <input
                        type="file"
                        accept="image/*"
                        id="add-photo-input"
                        style={{ display: 'none' }}
                        onChange={handleAddNewPhoto}
                      />
                      <label htmlFor="add-photo-input">
                        <Button variant="outlined" color="primary" component="span" className="add-button" style={{ width: '100%', marginTop: '10px' }}>
                          Add New
                        </Button>
                      </label>
                    </Grid>
                  )}
                </Grid>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default Dashboard;
