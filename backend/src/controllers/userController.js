import prisma from "../../prisma/client";
import { passwordHasher } from "../helpers/PasswordHelper";

export async function createOne(req, res) {
	const password = await passwordHasher(req.body.password);
	const data = { password, email: req.body.email };
	try {
		const newUser = await prisma.user.create({
			data,
			select: {
				id: true,
				email: true,
			},
		});
		res.status(201).json(newUser);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error new user");
	}
}

export async function readAll(_req, res) {
	try {
		const allUsers = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				orders: true,
			},
		});
		res.status(200).json(allUsers);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get users");
	}
}

export async function readOne(req, res) {
	try {
		const oneUser = await prisma.user.findUnique({
			where: { id: parseInt(req.params.id) },
			select: {
				id: true,
				email: true,
				orders: true,
			},
		});
		if (oneUser) {
			res.status(200).json(oneUser);
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get one user");
	}
}

export async function updateOne(req, res) {
	let password;
	if (req.body.password) {
		password = await passwordHasher(req.body.password);
	}
	const data = { password, email: req.body.email };
	if (req.payload.isAdmin) {
		data.isAdmin = req.body.isAdmin;
	}
	try {
		const oneUser = await prisma.user.update({
			where: { id: parseInt(req.params.id) },
			data,
			select: {
				id: true,
				email: true,
			},
		});
		res.status(201).json(oneUser);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get one user");
	}
}

export async function deleteOne(req, res) {
	try {
		// use deleteMany because delete (one) throw an error when it doesn't found a row
		await prisma.user.deleteMany({
			where: { id: parseInt(req.params.id) },
		});
		res.sendStatus(204);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error delete one user");
	}
}
