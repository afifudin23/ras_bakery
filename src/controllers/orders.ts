import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AuthReq } from "../middlewares/auth";
import NotFoundException from "../exceptions/not_found";
import { ErrorCode } from "../exceptions";
import { GetOrdersSchema, UpdateStatusOrdersSchema } from "../schemas/orders";

export const createOrder = async (req: AuthReq, res: Response, next: NextFunction) => {
    await prisma.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                user_id: req.user.id,
            },
            include: {
                product: true,
            },
        });
        if (cartItems.length === 0) {
            return res.json({ message: "Cart item is empty" });
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + current.quantity * +current.product.price;
        }, 0);

        // check default address
        const address = await tx.address.findFirst({
            where: {
                id: req.user.default_shipping_address!,
            },
        });
        const order = await tx.order.create({
            data: {
                user_id: req.user.id,
                net_amount: price,
                address: address?.fromatted_address!,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            product_id: cart.product_id,
                            quantity: cart.quantity,
                        };
                    }),
                },
            },
        });
        await tx.orderEvent.create({
            data: {
                order_id: order.id,
            },
        });
        await tx.cartItem.deleteMany({
            where: {
                user_id: req.user.id,
            },
        });
        res.json(order);
    });
};
export const getOrders = async (req: AuthReq, res: Response, next: NextFunction) => {
    const valid = GetOrdersSchema.parse(req.query);
    const orders = await prisma.order.findMany({
        where: {
            status: valid.status,
        },
        include: {
            products: true,
        },
    });
    if (orders.length === 0) {
        return res.json({ message: "Cart item is empty" });
    }
    res.json(orders);
};
export const cancelOrder = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const order = await prisma.order.update({
            where: {
                id: +req.params.id,
            },
            data: {
                status: "CANCELLED",
            },
        });
        await prisma.orderEvent.create({
            data: {
                order_id: +req.params.id,
                status: "CANCELLED",
            },
        });
        res.json(order);
    } catch (error) {
        return next(new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND));
    }
};

export const getOrderById = async (req: AuthReq, res: Response, next: NextFunction) => {
    const orders = await prisma.order.findMany({
        where: {
            id: +req.params.id,
            user_id: req.user.id,
        },
        include: {
            products: true,
            events: true,
        },
    });
    if (orders.length === 0) {
        return next(new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND));
    }
    res.json(orders);
};

export const changeStatusOrders = async (req: AuthReq, res: Response, next: NextFunction) => {
    const valid = UpdateStatusOrdersSchema.parse(req.body);
    try {
        
        const order = await prisma.order.update({
            data: {
                status: valid.status,
            },
            where: {
                id: +req.params.id,
            },
        });
        await prisma.orderEvent.create({
            data:{
                order_id: order.id,
                status: valid.status
            }
        })
        res.json(order);
    } catch (error) {
        return next(new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND));
    }
};
