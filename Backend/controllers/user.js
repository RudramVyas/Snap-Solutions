import mongoose from 'mongoose';
import User from '../models/users';

export const confirmation = async (req, res) => {
  try {
    // Get data from the request body
    const { id, otp, age, cameraMode, photoType, phoneNo, achievements, profileImageUrl, galleryImageUrls,city, state, photographerType } = req.body;
    console.log(profileImageUrl)
    // Fetch user by id from the database
    const user = await User.findById(id);

    // Check if user exists and OTP matches
    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP or user not found' });
    }


    if (age) user.age = age;
    if (cameraMode) user.cameraMode = cameraMode;
    if (photoType) user.photoType = photoType;
    if (phoneNo) user.phone = phoneNo;
    if (achievements) user.achievements = achievements;
    if (city) user.city = city;
    if (state) user.state = state;
    if (photographerType) user.photographerType = photographerType;
    if (profileImageUrl) user.profileImage = profileImageUrl;
    if (galleryImageUrls) user.photos = galleryImageUrls;
    user.verified=true;
    // Save the updated user to the database
    await user.save();

    // Send a success response
    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error in confirmation route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Update MongoDB document with the new user data
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllPhotographers = async (req, res) => {
  try {
    const users = await User.find({ type: 'photographer' });
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const photographer = async (req, res) => {
  const id = req.params.id;
  try {
    const photographer = await User.findById(id);
    if (!photographer) {
      return res.status(404).json({ message: 'Photographer not found' });
    }
    res.json(photographer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const connfirmclient = async (req, res) => {
  const { id, otp } = req.body;

  try {
    // Find the user by ID and OTP
    const user = await User.findOne({ _id: id, otp });

    // If the user is not found, or if already verified, respond accordingly
    if (!user || user.verified) {
      return res.status(400).json({ message: 'Invalid verification request.' });
    }

    // Update the user's 'verified' field to true
    user.verified = true;
    
    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Email verification successful.' });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};