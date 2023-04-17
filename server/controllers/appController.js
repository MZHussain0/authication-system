import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

/** Middleware to verify user */
export const verifyUser = asyncHandler(async (req, res, next) => {
  const { username } = req.method === "GET" ? req.query : req.body;

  // Check whether username exists
  const userExists = await User.findOne({ username });
  if (!userExists)
    return res.status(404).send({ message: "can't find user...!" });
  next();
});
/** POST: http://localhost:8000/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/

export const register = asyncHandler(async (req, res) => {
  const { username, password, email, profile } = req.body;

  // Check whether username exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Check whether email exists
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    profile: profile || "",
  });

  if (user) {
    res.status(201).send({ msg: "User created successfully" });
  } else {
    res.status(400);
    throw new Error("User not created");
  }
});

/** POST: http://localhost:8000/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const user = await User.findOne({ username });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res
      .status(200)
      .send({ token, username: user.username, msg: "Login Successfull...!" });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

/** GET: http://localhost:8000/api/user/example123 */
export const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }
  const { password, ...rest } = user._doc;
  res.status(200).send(rest);
});

/** PUT: http://localhost:8000/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  if (id) {
    const body = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    res.status(200).json({ user: updatedUser, msg: "Updated Successfully!" });
  }
});

/** GET: http://localhost:8080/api/generateOTP */
export const generateOTP = asyncHandler(async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).send({ code: req.app.locals.OTP });
});
/** GET: http://localhost:8080/api/verifyOTP */
export const verifyOTP = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(200).send({ msg: "OTP verified" });
  } else {
    return res.status(400).send({ error: "Invalid OTP" });
  }
});

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export const createResetSession = asyncHandler(async (req, res) => {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(200).send({ msg: "Access Granted!" });
  }
  return res.status(400).send({ error: "Session expired!" });
});

// update the password when we have valid session
/** PUT: http://localhost:8000/api/resetPassword */
export const resetPassword = asyncHandler(async (req, res) => {
  if (!req.app.locals.resetSession)
    return res.status(400).send({ error: "Session expired!" });
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await User.updateOne(
    {
      username: user.username,
    },
    { password: hashedPassword }
  );

  if (updatedUser) {
    res.status(201).send({ msg: "Password updated" });
  } else {
    res.status(400);
    throw new Error("failed to update password");
  }
});
