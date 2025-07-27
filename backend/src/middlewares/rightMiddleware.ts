export function isAdmin(req, res, next) {
	if (!req.payload) {
		console.error(
			"Make sure to use this middleware after verifyToken in routes"
		);
		return res.status(401).send("Invalid token");
	}
	if (req.payload.isAdmin) next();
	else res.sendStatus(403);
}

export function isOwner(req, res, next) {
	if (!req.payload) {
		console.error(
			"Make sure to use this middleware after verifyToken in routes"
		);
		return res.status(401).send("Invalid token");
	}
	if (req.payload.userId === parseInt(req.params.id) || req.payload.isAdmin)
		next();
	else res.sendStatus(403);
}
