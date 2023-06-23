import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwttoken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorize" });
  }
  // if token is exist then verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }

    req.user = user;
    next();
  });
};
