import { PrismaClient } from "@prisma/client";
import express from "express";
import rootRouter from "./routes";
import errorMiddleware from "./middlewares/error";
import { PORT } from "./keys";

const app = express();
app.use(express.json());
export const prisma = new PrismaClient().$extends({
    result: {
        address: {
            fromatted_address: {
                needs: {
                    lineOne: true,
                    city: true,
                    country: true,
                    pin_code: true
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.city}, ${addr.country}, ${addr.pin_code}`;
                }
            }
        }
    }
});

app.use("/api", rootRouter);

app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Apps is running in port ${PORT}!!`);
});
