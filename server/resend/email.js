import { resend } from "./config";

export const sendVerificationEmail = async (email, verficationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email address",
      html: `Verify your email address with this token: ${verficationToken}`,
    });
  } catch (error) {
    console.log(`Error sending verification Email: ${error}`);
    throw new Error("Error sending verification email");
  }
};
