import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import errorHandler from "../error_handler";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/products";

const productsRouter: Router = Router();

productsRouter.post("/", [authMiddleware, adminMiddleware], errorHandler(createProduct));
productsRouter.put("/:id", [authMiddleware, adminMiddleware], errorHandler(updateProduct));
productsRouter.delete("/:id", [authMiddleware, adminMiddleware], errorHandler(deleteProduct));
productsRouter.get("/", [authMiddleware], errorHandler(getAllProducts));
productsRouter.get("/:id", [authMiddleware], errorHandler(getProductById));

export default productsRouter;
