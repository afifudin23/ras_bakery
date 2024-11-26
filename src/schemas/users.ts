import { number, object, string } from "zod";

export const CreateAddress = object({
    lineOne: string(),
    lineTwo: string().optional(),
    city: string(),
    country: string(),
    pin_code: string().length(6),
});

export const UpdateAddressUser = object({
    name: string().optional(),
    default_shipping_address: number(),
    default_billing_address: number().optional(),
});
