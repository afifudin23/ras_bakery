import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import NotFoundException from "../exceptions/not_found";
import { ErrorCode } from "../exceptions";
import { CreateProductSchema } from "../schemas/products";

export const createProduct = async (req: Request, res: Response) => {
    CreateProductSchema.parse(req.body);
    const product = await prisma.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(", "),
        },
    });
    res.json(product);
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = req.body.tags ? req.body.tags.join(", ") : undefined;
        const product = await prisma.product.update({
            where: {
                id: +req.params.id,
            },
            data: {
                ...req.body,
                tags,
            },
        });
        res.json(product);
    } catch (error) {
        return next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND));
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await prisma.product.delete({
            where: {
                id: +req.params.id,
            },
        });
        res.json(product);
    } catch (error) {
        return next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND));
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    const count = await prisma.product.count();
    const data = await prisma.product.findMany({
        where:{
            name: {
                search: req.query.q?.toString(),
            },
            description: {
                search: req.query.q?.toString(),
            },
            tags: {
                search: req.query.q?.toString(),
            },
        },
        skip: +req.query.skip! || 0,
        take: 5,
    });
    res.json({ count, data });
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await prisma.product.findFirstOrThrow({
            where: {
                id: +req.params.id,
            },
        });
        res.json(product);
    } catch (error) {
        return next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND));
    }
};
