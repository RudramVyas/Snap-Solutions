import User from '../models/users';
import express from 'express';
const nodemailer = require('nodemailer');
import { hashPassword, comparePassword } from '../utils/auth';
import { nanoid } from 'nanoid';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
// Create or update a user profile
export const createOrUpdateUserProfile = async (req, res) => {
  try {
    const {
      name, city, mode, type, phone, achievements, email, link,
    } = req.body;

    // You may want to validate the data here

    // Check if a user profile already exists
    let userProfile = await User.findOne({ email: email });

    if (!userProfile) {
      // If the user profile doesn't exist, create a new one
      userProfile = new User({
        name,
        city,
        mode,
        type,
        phone,
        achievements,
        email,
        link,
      });
    } else {
      userProfile.name = name;
      userProfile.city = city;
      userProfile.mode = mode;
      userProfile.type = type;
      userProfile.phone = phone;
      userProfile.achievements = achievements;
      userProfile.link = link;
    }
    await userProfile.save();

    res.json({ ok: true, message: 'User profile created or updated successfully' });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};

// Fetch the user profile
export const fetchUserProfile = async (req, res) => {
  try {
    const {id}=req.params;
    const userProfile = await User.findOne({ _id:id });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json({ userProfile });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password,userType } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    let hashedPassword = await hashPassword(password);
    let otp = nanoid(6).toUpperCase();
    // Create a new user
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, otp,type:userType });
    await newUser.save();

    // Generate a confirmation link (replace 'YOUR_SERVER_URL' with your actual server URL)
    const confirmationLink = `http://localhost:3000/confirm/setup-profile/${newUser._id}/${otp}`;

    // Configure AWS SES
    const ses = new AWS.SES({
      accessKeyId: 'AKIA3HJDY7BVT65DBTF5',
      secretAccessKey: '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',
      region: 'us-east-1',
    });
    let params={}
    if(userType=="photographer"){
      const confirmationLink = `http://localhost:3000/confirm/setup-profile/${newUser._id}/${otp}`;
    // Send a confirmation email using AWS SES
     params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <p>Dear ${firstName} ${lastName},</p>
              <p>Thank you for signing up with us!</p>
              <p>Please click the following link to confirm your email and create your profile:</p>
              <a href="${confirmationLink}">${confirmationLink}</a>
              <p>Best regards,</p>
              <p>Snap Solutions</p>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Thank You for Signing Up',
        },
      },
      Source: 'shubham11patel@gmail.com', // Replace with your verified email address in AWS SES
    };
  }else{
    const confirmationLink = `http://localhost:3000/confirm/client/${newUser._id}/${otp}`;
    params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <p>Dear ${firstName} ${lastName},</p>
              <p>Thank you for signing up with us!</p>
              <p>Please click the following link to confirm your email:</p>
              <a href="${confirmationLink}">${confirmationLink}</a>
              <p>Best regards,</p>
              <p>Snap Solutions</p>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Thank You for Signing Up',
        },
      },
      Source: 'shubham11patel@gmail.com', // Replace with your verified email address in AWS SES
    };
  }
    await ses.sendEmail(params).promise();

    res.status(201).json({ message: 'User registered successfully. Confirmation email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error. Try again.' });
  }
};


export const signIn = async (req, res) => {
  try {
    const { email, password,userType } = req.body;

    // Find the user by email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found. Please sign up.' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await comparePassword(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }
    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    res.cookie('token', token, {
      httpOnly: true
    });
    res.status(200).json({ message: 'Sign-in successful.',user: existingUser});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error. Try again.' });
  }
};
