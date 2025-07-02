import { User } from "../model/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import { sendVerificationEmail } from "../resend/email.js";

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

export const login = (req, res) => {
  res.send("Login Route");
};
export const logout = (req, res) => {
  res.send("Logout Route");
};
