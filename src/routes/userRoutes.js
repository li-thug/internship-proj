import express from "express";
import * as AuthController from "../controllers/user.js";
import { verifyToken, Roles } from "../middleware/authVerify.js";
import { genLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/login", genLimiter, AuthController.login);


router.get("/", verifyToken(Roles.All), AuthController.getAllUsers);
router.get("/:id", verifyToken(Roles.All), AuthController.getUserProfile);
router.put("/:id", verifyToken(Roles.All), AuthController.updateUserProfile);
router.delete("/:id", verifyToken(Roles.All), AuthController.deleteAUser);


export default router;