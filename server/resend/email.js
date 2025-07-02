import { resend } from "./config.js";
import {
  resetPasswordEmailTemplate,
  verficationTokenEmailTemplate,
  welcomeEmailTemplate,
} from "./email-templats.js";

export const sendVerificationEmail = async (email, verficationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email address",
      html: verficationTokenEmailTemplate.replace(
        "{verificationToken}",
        verficationToken
      ),
    });
  } catch (error) {
    console.log(`Error sending verification Email: ${error}`);
    throw new Error("Error sending verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to our Company",
      html: welcomeEmailTemplate.replace("{userName}", name),
    });
  } catch (error) {
    console.log(`Error sending verification Email: ${error}`);
    throw new Error("Error sending Welcome email");
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset",
      html: resetPasswordEmailTemplate.replace("{resetPasswordUrl}", resetURL),
    });
  } catch (error) {
    console.log(`Error sending Reset Password Email: ${error}`);
    throw new Error("Error sending Reset Password email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset Successful",
      html: `Your password was reset successfuly`,
    });
  } catch (error) {
    console.log(`Error sending Success Reset Password Email: ${error}`);
    throw new Error("Error Success sending Reset Password email");
  }
};
