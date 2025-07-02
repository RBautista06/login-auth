import { User } from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../resend/email.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
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
  const { email, password } = req.body;
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
        sucess: false,
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
