import { resend } from "./config.js";
import {
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
