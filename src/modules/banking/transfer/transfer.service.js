import { z } from "zod";
import {
    createTransferInRepository,
    getTransfersInRepository
} from "./transfer.repository.js";
import { HttpBadRequest } from "@httpx/exception";

const TransferSchema = z.object({
    sourceAccountId: z.number(),
    destAccountId: z.number(),
    amount: z.number().refine(val => val > 0, {
        message: "Negative amount"
    }),
});

export async function createTransfer(data) {
    const result = TransferSchema.safeParse(data);
    if (result.success) {
        return createTransferInRepository(result.data);
    } else {
        throw new HttpBadRequest(result.error.issues[0].message);
    }
}

export async function getTransfers(userId) {
    if (typeof userId !== "number" || userId <= 0) {
        throw new HttpBadRequest("Invalid user ID");
    }
    return getTransfersInRepository(userId);
}
