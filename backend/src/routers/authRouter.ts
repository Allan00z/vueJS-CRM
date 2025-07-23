import { Router } from "express";
const router = Router();

import { login } from "../controllers/authControllers";
import { generateToken } from "../middlewares/tokenMiddleware";

// Login
router.post("/login", login, generateToken);

export default router;
