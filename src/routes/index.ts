import { Router } from "express";
import authRouter from "./auth";
import productsRouter from "./products";
import usersRouter from "./users";
import cartItemRoutes from "./cart_items";
import ordersRoutes from "./orders";

const rootRouter: Router = Router();
rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productsRouter);
rootRouter.use("/users", usersRouter);
rootRouter.use("/users", cartItemRoutes);
rootRouter.use("/orders", ordersRoutes);

export default rootRouter;
