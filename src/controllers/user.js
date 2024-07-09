import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import generateToken from "../config/generateToken.js";
import env from "../utlis/validateEnv.js";

const createToken = async (userId, token) => {
  const createToken = new Token(userId, token);
  return createToken.save();
};

const verifyToken = async (userId, token) => {
  return await Token.findOne(userId, token);
};

export const signUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    try {
      if (!userName || !email || !password) {
        return next(createHttpError(400, "Form fields missing"));
      }
      const currentUserName = await User.findOne({ userName });
      if (currentUserName) {
        return next(
          createHttpError(409, "Username already exists, choose another")
        );
      }
      const currentEmail = await User.findOne({ email });
      if (currentEmail) {
        return next(createHttpError(409, "Email already exists, choose another"));
      }
      if (!currentUserName || !currentEmail) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
          userName,
          email,
          password: hashedPassword,
        });
        const access_token = generateToken(user._id, user.role);
        let setToken = await createToken({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });
        if (!setToken) return next(createHttpError(400, "Error creating token"));
        const messageLink = `${env.BASE_URL}/verify-email/${user._id}/${setToken.token}`;
        if (!messageLink) {
          return next(createHttpError(400, "Verification link not found"));
        }
        res
          .status(201)
          .json({access_token, msg: "User registration successfull" });
      }
    } catch (error) {
      next(error);
    }
  };

  export const login = async (req, res, next) => {
    const { userName, password } = req.body;
    try {
      if (!userName || !password) {
        return next(createHttpError(400, "Form fields missing"));
      }
      const user = await User.findOne({ userName: userName }).select("+password");
      if (!user) {
        return next(createHttpError(401, "Username or Password is incorrect"));
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return next(createHttpError(401, "Username or Password is incorrect"));
      }
      const access_token = generateToken(user._id, user.role);
      res.status(200).json({ access_token, msg: "Login successful" });
    } catch (error) {
      next(error);
    }
  };

  export const getUserProfile = async (req, res, next) => {
    const { userName } = req.params;
    try {
      if (!userName) {
        return next(createHttpError(400, "No params requested"));
      }
      const user = await User.findOne({ userName: userName });
      if (!user) {
        return next(createHttpError(404, `User not found ${userName}`));
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
  
  export const deleteAUser = async (req, res, next) => {
    const { id: userId } = req.user;
    try {
      if (!isValidObjectId(userId) || !isValidObjectId(userId)) {
        return next(createHttpError(400, "Invalid user id"));
      }
      if (!userId) {
        return next(createHttpError(400, "userId is missing"));
      }
      const user = await User.findById(userId);
      if (!user) {
        return next(createHttpError(404, "User not found"));
      }
      if (!user._id.equals(userId._id)) {
        return next(createHttpError(401, "You can only delete your own account"));
      }
      await user.deleteOne();
      res.status(200).send("User deleted!");
    } catch (error) {
      next(error);
    }
  };
  

  export const updateUserProfile = async (req, res, next) => {
    const { id: userId } = req.user;
    const { userName, email, password, profilePhoto, bio } = req.body;
    try {
      if (!isValidObjectId(userId)) {
        return next(createHttpError(400, `Invalid userId: ${userId}`));
      }
      if (!userId) {
        return next(createHttpError(404, "User not found"));
      }
      const updatedFields = {
        userName,
        email,
        password: password && (await bcrypt.hash(password, 10)),
        profilePhoto,
        bio,
      };
      Object.keys(updatedFields).forEach(
        (key) =>
          (updatedFields[key] === "" || undefined) && delete updatedFields[key]
      );
      const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
        new: true,
      });
      if (!updatedUser) {
        return next(createHttpError(404, "User not found"));
      }
      if (!updatedUser._id.equals(userId)) {
        return next(createHttpError(401, "You cannot access this user"));
      }
      res.status(200).json({
        msg: "User info updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  

  exports.getAllUsers = async (req, res) => {
    const { userName } = req.params;
    try {
      if (!userName) {
        return next(createHttpError(400, "No params requested"));
      }
      const user = await User.findAll({ userName: userName });
      if (!user) {
        return next(createHttpError(404, `User not found ${userName}`));
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
