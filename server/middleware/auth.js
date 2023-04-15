import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("Invalid token/unauthorized");
      }
      req.user = decoded;
      next();
    });

    if (!token) {
      res.status(401);
      throw new Error("Token is required or missing");
    }
  }
});
