import bcrypt from "bcrypt";

export async function passwordHasher(password) {
	try {
		return await bcrypt.hash(password, 10);
	} catch (err) {
		console.log(err);
	}
}

export async function passwordVerification(password, hashedPassword) {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Error");
	}
}
