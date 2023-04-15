import { Router } from "express";
const router = Router();

// Import all controllers //
import * as controller from "../controllers/appController.js";
import { localVariable, validateToken } from "../middleware/auth.js";

// POST METHODS //
router.route("/register").post(controller.register);
// router.route("/registerMail").post();
router.route("/authenticate").post((req, res) => res.end());
router.route("/login").post(controller.verifyUser, controller.login);

// GET METHODS //
router.route("/user/:username").get(controller.getUser);
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariable, controller.generateOTP);
router.route("/verifyOTP").get(controller.verifyOTP);
router.route("/createResetSession").get(controller.createResetSession);

// PUT METHODS //
router.route("/updateUser").put(validateToken, controller.updateUser);
router
  .route("/resetpassword")
  .put(controller.verifyUser, controller.resetPassword);
export default router;
