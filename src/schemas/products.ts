import { number, object, string } from "zod";

export const CreateProductSchema = object({
    name: string(),
    description: string(),
    price: number(),
    tags: string().array(),
});
