import prisma from "../../prisma/client";

export async function createOne(req, res) {
	const { order } = req.body;
	const { userId } = req.payload;
	try {
		let products = [];
		for (const productOrder of order) {
			let { price } = await prisma.product.findUniqueOrThrow({
				where: { id: parseInt(productOrder.id) },
			});
			const quantity = productOrder.quantity ?? 1;
			products.push({
				quantity,
				totalPrice: quantity * price.toNumber(),
				id: productOrder.id,
			});
		}

		const newOrder = await prisma.order.create({
			data: {
				totalPrice: products.reduce((acc, curr) => acc + curr.totalPrice, 0),
				userId,
				products: {
					create: products.map((product) => {
						return {
							quantity: product.quantity,
							totalPrice: product.totalPrice,
							product: { connect: { id: product.id } },
						};
					}),
				},
			},
			include: {
				products: {
					include: {
						product: {
							include: {
								category: true,
							},
						},
					},
				},
			},
		});
		res.status(201).json(newOrder);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error new order");
	}
}

export async function readAll(_req, res) {
	try {
		const allOrders = await prisma.order.findMany({
			include: {
				user: {
					select: {
						firstName: true,
						lastName: true,
						email: true,
					},
				},
			},
		});
		res.status(200).json(allOrders);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get orders");
	}
}

export async function readOne(req, res) {
	try {
		const oneOrder = await prisma.order.findUnique({
			where: { id: parseInt(req.params.id) },
			include: {
				products: {
					include: {
						product: {
							include: {
								category: true,
							},
						},
					},
				},
			},
		});
		if (oneOrder) {
			res.status(200).json(oneOrder);
		} else {
			res.sendStatus(404);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json("Error get one order");
	}
}

// export async function updateOne(req, res) {
// 	const { products, userId } = req.body;
// 	/**@todo Rework all this function */
// 	let totalPrice = 0;
// 	for (const product of products) {
// 		let { price } = await prisma.product.findUniqueOrThrow({
// 			where: { id: parseInt(product.id) },
// 		});
// 		product.quantity ? product.quantity : (product.quantity = 1);
// 		totalPrice = totalPrice + price * product.quantity;
// 	}

// 	try {
// 		const oneOrder = await prisma.order.update({
// 			where: { id: parseInt(req.params.id) },
// 			data: {
// 				totalPrice,
// 				userId,
// 				products: {
// 					set: [],
// 					create: products.map((product) => {
// 						return {
// 							quantity: product.quantity,
// 							product: { connect: { id: product.id } },
// 						};
// 					}),
// 				},
// 			},
// 			include: {
// 				products: {
// 					include: {
// 						category: true,
// 					},
// 				},
// 			},
// 		});
// 		res.status(201).json(oneOrder);
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json("Error get one order");
// 	}
// }

export async function deleteOne(req, res) {
	// products ?????????? RELATION
	try {
		// use deleteMany because delete (one) throw an error when it doesn't found a row
		await prisma.order.deleteMany({
			where: { id: parseInt(req.params.id) },
		});
		res.sendStatus(204);
	} catch (error) {
		console.error(error);
		res.status(500).json("Error delete one order");
	}
}
