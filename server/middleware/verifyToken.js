import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    console.log(decoded);
    req.userId = decoded.userId; // the request will have userId in its object
    next();
  } catch (error) {
    console.log(`Error Verifying Token: ${error}`);
    return res
      .status(401)
      .send({ success: false, message: "Invalid or expired token" });
  }
};
