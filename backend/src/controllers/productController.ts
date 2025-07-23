import prisma from "../../prisma/client";

export async function createOne(req, res) {
	const data = {
		price: req.body.price,
		// img: req.body.img,
		name: req.body.name,
		categoryId: req.body.categoryId,
	};

	try {
		const newproduct = await prisma.product.create({
			data,
			include: {
				category: {
					select: {
						name: true,
					},
				},
			},
		});
		res.status(201).json(newproduct);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error new product");
	}
}

export async function readAll(_req, res) {
	try {
		const allproducts = await prisma.product.findMany({
			include: {
				category: {
					select: {
						name: true,
					},
				},
			},
		});
		res.status(200).json(allproducts);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get products");
	}
}

export async function readOne(req, res) {
	try {
		const oneproduct = await prisma.product.findUnique({
			where: { id: parseInt(req.params.id) },
			include: {
				category: {
					select: {
						name: true,
					},
				},
			},
		});
		if (oneproduct) {
			res.status(200).json(oneproduct);
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get one product");
	}
}

export async function updateOne(req, res) {
	const data = {
		price: req.body.price,
		// img: req.body.img,
		name: req.body.name,
		categoryId: req.body.categoryId,
	};

	try {
		const oneproduct = await prisma.product.update({
			where: { id: parseInt(req.params.id) },
			data,
			include: {
				category: {
					select: {
						name: true,
					},
				},
			},
		});
		res.status(201).json(oneproduct);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get one product");
	}
}

export async function deleteOne(req, res) {
	try {
		// use deleteMany because delete (one) throw an error when it doesn't found a row
		await prisma.product.deleteMany({
			where: { id: parseInt(req.params.id) },
		});
		res.sendStatus(204);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error delete one product");
	}
}
