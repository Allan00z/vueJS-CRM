import { Router } from "express";
const router = Router();

import {
	createOne,
	readAll,
	readOne,
	updateOne,
	deleteOne,
} from "../controllers/productController";
import { isAdmin } from "../middlewares/rightMiddleware";
import { verifyToken } from "../middlewares/tokenMiddleware";

router.get("/", readAll);
router.get("/:id", readOne);

// security middleware by JWT (admin)
router.use(verifyToken);
router.use(isAdmin);

router.post("/", createOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
