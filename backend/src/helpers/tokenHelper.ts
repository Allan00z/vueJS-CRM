import { sign } from "jsonwebtoken";
import { readFileSync } from "fs";
const privateKey = readFileSync("jwtRS256.key");

export default function tokenGenerator() {
	const token = sign(payload, privateKey, {
		algorithm: "RS256",
	});
	return token;
}
