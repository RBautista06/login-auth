// Generate a random 6-digit verification code as a string (e.g., "483920")
export const generateVerificationToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
