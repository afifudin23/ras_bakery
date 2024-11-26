import { NextFunction, Response } from "express";
import { AuthReq } from "../middlewares/auth";
import { prisma } from "..";
import { ErrorCode } from "../exceptions";
import NotFoundException from "../exceptions/not_found";
import { ChangeQuantityItemSchema, CreateItemSchema } from "../schemas/cart_items";

export const addItemToCart = async (req: AuthReq, res: Response, next: NextFunction) => {
    CreateItemSchema.parse(req.body);
    const product = await prisma.product.findFirst({
        where: {
            id: +req.params.product_id,
        },
    });
    if (!product) {
        return next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND));
    }
    const cartItem = await prisma.cartItem.create({
        data: {
            user_id: +req.user.id,
            product_id: +req.params.product_id,
            quantity: req.body.quantity,
        },
    });
    res.json(cartItem);
};
export const getItemFormCart = async (req: AuthReq, res: Response, next: NextFunction) => {
    const cartItems = await prisma.cartItem.findMany({
        where: {
            user_id: req.user.id,
        },
        include: {
            product: true,
        },
    });
    res.json(cartItems);
};
export const changeQuantityItem = async (req: AuthReq, res: Response, next: NextFunction) => {
    ChangeQuantityItemSchema.parse(req.body);
    try {
        const cartItem = await prisma.cartItem.update({
            where: {
                id: +req.params.cart_id,
            },
            data: {
                ...req.body,
            },
        });
        res.json(cartItem);
    } catch (error) {
        return next(new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND));
    }
};
export const deleteItemFromCart = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const cartItem = await prisma.cartItem.delete({
            where: {
                id: +req.params.cart_id,
            },
        });
        res.json({ status: "deleted success", cartItem });
    } catch (error) {
        return next(new NotFoundException("Cart not found", ErrorCode.CART_NOT_FOUND));
    }
};
