import prisma from "../../prisma/client";

export async function createOne(req, res) {
	const data = { name: req.body.name };
	try {
		const newCategory = await prisma.category.create({
			data,
		});
		res.status(201).json(newCategory);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error new category");
	}
}

export async function readAll(_req, res) {
	try {
		const allCategorys = await prisma.category.findMany();
		res.status(200).json(allCategorys);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get categorys");
	}
}

export async function readOne(req, res) {
	try {
		const oneCategory = await prisma.category.findUnique({
			where: { id: parseInt(req.params.id) },
			include: {
				products: { include: { category: true } },
			},
		});
		if (oneCategory) {
			res.status(200).json(oneCategory);
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get one category");
	}
}

export async function updateOne(req, res) {
	const data = { name: req.body.name };

	try {
		const oneCategory = await prisma.category.update({
			where: { id: parseInt(req.params.id) },
			data,
		});
		res.status(201).json(oneCategory);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get one category");
	}
}

export async function deleteOne(req, res) {
	try {
		// use deleteMany because delete (one) throw an error when it doesn't found a row
		await prisma.category.deleteMany({
			where: { id: parseInt(req.params.id) },
		});
		res.sendStatus(204);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error delete one category");
	}
}
