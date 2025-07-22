import { verify, sign } from "jsonwebtoken";
import { readFileSync } from "fs";
const privateKey = readFileSync("jwtRS256.key");

export function verifyToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).send("Unauthorized access");
	}

	try {
		const decoded = verify(token, privateKey);
		req.payload = decoded;
		next();
	} catch (error) {
		return res.status(401).send("Invalid token");
	}
}

export function generateToken(req, res) {
	try {
		const payload = {
			userId: req.user.id,
			email: req.user.email,
			isAdmin: req.user.isAdmin,
		};
		const token = sign(payload, privateKey, {
			expiresIn: "24h",
			algorithm: "RS256",
		});
		res.status(200).send({ token });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal Error");
	}
}
