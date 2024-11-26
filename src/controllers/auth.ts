import jwt, { sign } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { compare, hash } from "bcryptjs";
import BadRequestException from "../exceptions/bad_request";
import { ErrorCode } from "../exceptions";
import { JWT_TOKEN } from "../keys";
import { LoginSchema, SignUpSchema } from "../schemas/auth";
import NotFoundException from "../exceptions/not_found";
import { AuthReq } from "../middlewares/auth";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body);
    const { name, email, password } = req.body;
    let user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (user) {
        return next(new BadRequestException("User already exist", ErrorCode.USER_ALREADY_EXIST));
    }
    user = await prisma.user.create({
        data: {
            name,
            email,
            password: await hash(password, 10),
        },
    });
    const { password: pass, ...data } = user;
    res.json(data);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    LoginSchema.parse(req.body);
    const { email, password } = req.body;
    let user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return next(new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND));
    }
    if (!(await compare(password, user!.password))) {
        return next(new BadRequestException("Incorrect password", ErrorCode.INCORRECT_PASSWORD));
    }
    const { password: pass, ...data } = user!;
    const token = jwt.sign({ id: user!.id }, JWT_TOKEN!);
    res.json({ data, token });
};

export const me = async (req: AuthReq, res: Response, next: NextFunction) => {
    const { password, ...data } = req.user;
    res.json(data);
};
