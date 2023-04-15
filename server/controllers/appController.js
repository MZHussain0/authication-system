import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";

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
    res.status(201).json({ _id: user.id, email: user.email });
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
export async function login(req, res) {
  res.json("login route");
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  res.json("getUser route");
}

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
export async function updateUser(req, res) {
  res.json("updateUser route");
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  res.json("generateOTP route");
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  res.json("verifyOTP route");
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  res.json("createResetSession route");
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  res.json("resetPassword route");
}
