import { z } from "zod";
import {
    createAccountInRepository,
    deleteAccountByIdInRepository,
    getAccountByIdInRepository
} from "./account.repository.js";
import {HttpBadRequest} from "@httpx/exception";

const AccountSchema = z.object({
    userId: z.string(),
    balance: z.number(),
});

export async function createAccount(data) {
    const result = AccountSchema.safeParse(data);

    if (result.success) {
        return createAccountInRepository(result.data);
    } else {
        throw new HttpBadRequest(result.error);
    }
}

export async function getAccountById(id, userId, amount) {
    const result = AccountSchema.safeParse({id, userId, amount});
    if (result.success) {
        return getAccountByIdInRepository(id, userId, amount);
    } else {
        throw new HttpBadRequest(result.error);
    }
}


export async function deleteAccountById(id) {
    const result = AccountSchema.safeParse({id});
    if (result.success) {
        return deleteAccountByIdInRepository(id);
    } else {
        throw new HttpBadRequest(result.error);
    }
}