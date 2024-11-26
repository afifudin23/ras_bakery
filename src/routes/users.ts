import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { changeUserRole, createAddress, deleteAddress, getAllAddress, getAllUsers, getUserById, updateAddressUser } from "../controllers/users";
import errorHandler from "../error_handler";

const usersRouter: Router = Router();

usersRouter.post("/address", [authMiddleware], errorHandler(createAddress));
usersRouter.get("/address", [authMiddleware], errorHandler(getAllAddress));
usersRouter.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
usersRouter.put("/address", [authMiddleware], errorHandler(updateAddressUser));
usersRouter.get("/", [authMiddleware], errorHandler(getAllUsers));
usersRouter.get("/:id", [authMiddleware], errorHandler(getUserById));
usersRouter.put("/role/:id", [authMiddleware], errorHandler(changeUserRole));


export default usersRouter;
