import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { addItemToCart, changeQuantityItem, deleteItemFromCart, getItemFormCart } from "../controllers/cart_items";
import errorHandler from "../error_handler";

const cartItemRoutes: Router = Router();

cartItemRoutes.post("/cart/:product_id", [authMiddleware], errorHandler(addItemToCart));
cartItemRoutes.get("/cart", [authMiddleware], errorHandler(getItemFormCart));
cartItemRoutes.put("/cart/:cart_id", [authMiddleware], errorHandler(changeQuantityItem));
cartItemRoutes.delete("/cart/:cart_id", [authMiddleware], errorHandler(deleteItemFromCart));

export default cartItemRoutes;
