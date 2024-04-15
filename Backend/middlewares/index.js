import jwt from 'jsonwebtoken';
import User from '../models/users';

export const requireSignin = (req, res, next) => {
  console.log(req)
    const token = req.cookies.token;
    console.log(token)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.user = decoded;
      next();
    });
  };

export const isPhotographer=async (req,res,next)=>{
  try {
    const user = await User.findById(req.user._id).select({"email":1}).exec();
    if (!user) {
      return res.sendStatus(403);
    } 
    next();
  } catch (err) {
    console.log(err);
  }
};
