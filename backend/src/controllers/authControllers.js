import prisma from "../../prisma/client";
import { passwordVerification } from "../helpers/PasswordHelper";

export async function login(req, res, next) {
	const { email, password } = req.body;
	if (!email || !password) return res.status(422).send("Unprocessable Entity");

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (!user) {
			res.status(404).send("User Not Found");
		} else {
			const isVerified = await passwordVerification(password, user.password);
			if (!isVerified) {
				res.status(401).send("Unauthorized");
			} else {
				delete user.password;
				req.user = user;
				next();
			}
		}
	} catch (error) {
		console.error(error);
		return { status: 500, data: "Internal Error" };
	}
}
