import { User } from "../model/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../resend/email.js";

export const signup = async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email.toLowerCase();
  try {
    if (!name || !email || !password) {
      return res.status(400).send("all fields are required");
    }
    const userAlreadyExist = await User.findOne({ email }); // Check the database to see if a user with this email already exists
    if (userAlreadyExist) {
      return res
        .status(400)
        .send("Email already taken. Please use another email");
    }

    // encrypt the password in 10 salted rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    //creating user to the database
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // expires at 1 day
    });

    await user.save();
    // generate a token
    generateJWTToken(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).send({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc, // you can access the whole user document by accessing the _doc
        password: undefined, // make sure that the password will not be sent back to the clien side
      },
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const login = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  try {
    const user = await User.findOne({ email }); // Look for a user in the database with the given email
    const isPasswordValid = await bcrypt.compare(password, user.password); // Check if the entered password matches the user's hashed password

    // If the user doesn't exist or the password is incorrect, send an error response
    if (!user || !isPasswordValid) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Credentials" });
    }

    // Check if the user's email is verified
    const isVerified = user.isVerified;
    if (!isVerified) {
      return res
        .status(400)
        .send({ success: false, message: "Email is not Verified" });
    }

    generateJWTToken(res, user._id); // If login is successful, generate a JWT token and attach it (usually as a cookie)

    res.status(200).send({ success: true, message: "Login Successful" });
  } catch (error) {
    console.log("Error Logging In", error);
    res.status(400).send(error);
  }
};
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ success: true, message: "Logged out successfully" });
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid or Expired Verification Code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    res
      .status(200)
      .send({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    console.log("Error verifying Email", error);
    res.status(400).send(error);
  }
};

export const forgotPassword = async (req, res) => {
  const email = req.body.email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hoour expiration date
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordTokenExpiresAt;
    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );
    res.status(200).send({
      success: true,
      message: "Password Reset Email sent successfully",
    });
  } catch (error) {
    console.log("Error Password Reset Email", error);
    res.status(400).send(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token, // make sure the the reset password matches the token from the params
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Reset Password Token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    //make the reset password token and expires at to be undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res.status(200).send({
      success: true,
      message: "Password reset Successfuly",
    });
  } catch (error) {
    console.log("Error Success Password Reset Email", error);
    res.status(400).send(error);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log(req.userId);
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .send({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.log("error checking auth", error);
    res.status(400).send({ success: false, message: error.message });
  }
};
