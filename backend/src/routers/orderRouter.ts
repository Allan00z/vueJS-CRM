import { Router } from "express";
const router = Router();

import {
	createOne,
	readAll,
	readOne,
	// updateOne,
	deleteOne,
} from "../controllers/orderController";
import { isAdmin, isOwner } from "../middlewares/rightMiddleware";

router.post("/", createOne);
// router.get('/user/', readAll) // User orders
router.get("/:id", isOwner, readOne);

// security middleware by JWT (admin can see all, user only his)
router.use(isAdmin);

router.get("/", readAll);
router.delete("/:id", deleteOne);

/**@todo Rework this */
// router.put('/:id', updateOne)

export default router;
