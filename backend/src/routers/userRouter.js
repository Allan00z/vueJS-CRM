import { Router } from "express";
const router = Router();

import { verifyToken } from "../middlewares/tokenMiddleware";
import {
	createOne,
	readAll,
	readOne,
	updateOne,
	deleteOne,
} from "../controllers/userController";
import { isAdmin, isOwner } from "../middlewares/rightMiddleware";

router.post("/", createOne);

router.use(verifyToken);

router.get("/:id", isOwner, readOne);
router.put("/:id", isOwner, updateOne);

router.use(isAdmin);

router.get("/", readAll);
router.delete("/:id", deleteOne);

export default router;
