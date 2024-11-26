import { NextFunction, Request, Response } from "express";
import { AuthReq } from "../middlewares/auth";
import { prisma } from "..";
import { CreateAddress, UpdateAddressUser } from "../schemas/users";
import NotFoundException from "../exceptions/not_found";
import { ErrorCode } from "../exceptions";
import BadRequestException from "../exceptions/bad_request";

export const createAddress = async (req: AuthReq, res: Response, next: NextFunction) => {
    CreateAddress.parse(req.body);
    const user = await prisma.user.findFirst({
        where: {
            id: +req.user.id,
        },
    });
    if (!user) {
        return next(new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
    }
    const address = await prisma.address.create({
        data: {
            ...req.body,
            user_id: user.id,
        },
    });
    res.json(address);
};

export const getAllAddress = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const addresses = await prisma.address.findMany({
            where: {
                user_id: req.user.id,
            },
        });
        res.json(addresses);
    } catch (error) {
        return next(new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
    }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const address = await prisma.address.delete({
            where: {
                id: +req.params.id,
            },
        });
        res.json({ deleted: "success", address });
    } catch (error) {
        return next(new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND));
    }
};

export const updateAddressUser = async (req: AuthReq, res: Response, next: NextFunction) => {
    const validatedData = UpdateAddressUser.parse(req.body);

    const shippingAddress = await prisma.address.findFirst({
        where: {
            id: +validatedData.default_shipping_address,
        },
    });
    if (!shippingAddress) {
        return next(new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND));
    }
    if (shippingAddress?.user_id !== req.user.id) {
        return next(new BadRequestException("Address does not belong to users", ErrorCode.ADDRESS_DOES_NOT_BELONG));
    }

    if (validatedData.default_billing_address) {
        const billingAddress = await prisma.address.findFirst({
            where: {
                id: +validatedData.default_billing_address,
            },
        });
        if (!billingAddress) {
            return next(new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND));
        }
        if (billingAddress?.user_id !== req.user.id) {
            return next(new BadRequestException("Address does not belong to users", ErrorCode.ADDRESS_DOES_NOT_BELONG));
        }
    } else {
        validatedData.default_billing_address = validatedData.default_shipping_address;
    }
    const updatedAddressUser = await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: validatedData,
    });
    const { password, role, ...data } = updatedAddressUser;
    res.json(data);
};

export const getAllUsers = async (req: AuthReq, res: Response, next: NextFunction) => {
    const count = await prisma.user.count();
    const data = await prisma.user.findMany({
        take: 10,
        orderBy: {
            role: "asc",
        },
    });
    const users = data.map((user)=> {
        const { password, ...data } = user;
        return data;
    })
    res.json({ count, users });
};

export const getUserById = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const data = await prisma.user.findFirstOrThrow({
            where: {
                id: +req.params.id,
            },
            include: {
                addresses: true,
                cart_items: true,
                orders: true,
            },
        });
        const { password, ...user } = data;
        res.json(user);
    } catch (error) {
        return next(new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
    }
};
export const changeUserRole = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const data = await prisma.user.update({
            data: {
                role: req.body.role,
            },
            where: {
                id: +req.params.id,
            },
        });
        const { password, ...user } = data;
        res.json(user);
    } catch (error) {
        return next(new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
    }
};
