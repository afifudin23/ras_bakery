import { nativeEnum, object } from "zod";

enum OrderStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}
export const GetOrdersSchema = object({
    status: nativeEnum(OrderStatus).optional(),
});
export const UpdateStatusOrdersSchema = object({
    status: nativeEnum(OrderStatus),
});