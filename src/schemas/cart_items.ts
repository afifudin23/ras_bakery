import { number, object } from "zod";

export const CreateItemSchema = object({
    quantity: number().optional(),
});
export const ChangeQuantityItemSchema = object({
    quantity: number(),
});
