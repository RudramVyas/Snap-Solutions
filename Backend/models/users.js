import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Additional fields for user profile
  city: {
    type: String,
  },
  age: {
    type: Number,
  },
  cameraMode: {
    type: String,
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  photographerType: {
    type: String,
  },
  achievements: {
    type: String,
  },
  link: {
    type: String,
  },
  otp: {
    type: String,
  },
  photos: [
    {
      type: String, // Assuming you store photo URLs as strings
    },
  ],
  profileImage: {
    type: String, // Assuming you store photo URLs as strings
  },
  phone: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false, // Set default value to false
  },
  type: {
    type: String,
    enum: ['client', 'photographer'], 
    required: true,
  },
  // ... (other fields remain the same)
}, { timestamps: true });

userSchema.index({ firstName: 'text', lastName: 'text' }); // Index the 'firstName' and 'lastName' fields for text search

export default mongoose.model('User', userSchema);
