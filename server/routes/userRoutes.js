import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login);
userRouter.put("/update-profile",protect,updateProfile);
userRouter.get("/check",protect,checkAuth);

export default userRouter;