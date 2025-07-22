import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "morgan";
import path from "path";

// import authRoutes from "./routes/auth";
// import productRoutes from "./routes/product";

// const app = express();

// app.use(cors());

// app.use("/api/auth", authRoutes);
// app.use("api/products", productRoutes);

// app.listen(PORT, () => {
// 	console.log(`Serveur démarré sur http://localhost:${PORT}`);
// });

const app = express();
const PORT = 3000;
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(
	cors({
		origin: "http://localhost:8080",
		optionsSuccessStatus: 200,
	})
);

// Import routers
// Use Routers
// const indexRouter = require('./routers/indexRouter');
// app.use('/', indexRouter);

import authRouter from "./routers/authRouter";
app.use("/auth", authRouter);

import userRouter from "./routers/userRouter";
app.use("/user", userRouter);

import categoryRouter from "./routers/categoryRouter";
app.use("/category", categoryRouter);

import productRouter from "./routers/productRouter";
app.use("/product", productRouter);

import { verifyToken } from "./middlewares/tokenMiddleware";
app.use(verifyToken);

import orderRouter from "./routers/orderRouter";
app.use("/order", orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json(err.message);
});

app.listen(PORT, (err) => {
	if (err) {
		console.error("Something bad happened");
	} else {
		// eslint-disable-next-line no-restricted-syntax
		console.log(`Server is listening on ${PORT}`);
	}
});
