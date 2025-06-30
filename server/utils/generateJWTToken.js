import jwt from "jsonwebtoken";

export const generateJWTToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

/*
  This function generates a JSON Web Token (JWT) and stores it in a cookie.

  - It takes the user's ID and signs it into a JWT using the secret key stored in the .env file (JWT_SECRET).
  - The token will expire in 7 days.

  - It then sets a cookie on the response object:
    - The cookie name is "token" and its value is the JWT.
    - httpOnly: true → The cookie cannot be accessed from JavaScript in the browser (helps prevent XSS attacks).
    - secure: true in production → The cookie will only be sent over HTTPS connections.
    - sameSite: "strict" → The cookie will not be sent in cross-site requests (helps prevent CSRF attacks).
    - maxAge: 7 days in milliseconds → This is how long the cookie will be valid.

  - Finally, it returns the generated token in case you want to use it elsewhere (e.g., in JSON response).
*/
