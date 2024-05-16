import { describe, it, vi, expect, afterEach } from "vitest";
import {createAccount, getAccountById, deleteAccountById} from "./account.service.js";

vi.mock("./account.repository", async (importOriginal) => ({
    ...(await importOriginal()),
    createAccountInRepository: vi.fn((data) => {
        return {
            id: 4,
            userId: data.userId,
            balance: data.balance,
        };
    }),
    getAccountByIdInRepository: vi.fn((id, userId, amount) => {
        return {
            id: id,
            userId: userId,
            balance: amount,
        };
    }),
    deleteAccountByIdInRepository: vi.fn((id) => {
        return {
            id: id,
        };
    }),
}));

describe("Account Service", () => {
    afterEach(() => vi.clearAllMocks());

    it("should create an account", async () => {
        try {
            await createAccount({
                userId: 1,
                balance : 9999,
            });
            assert.fail("should trigger a bad request error when account creation.");
        } catch (e) {
            expect(e.name).toBe('HttpBadRequest');
            expect(e.statusCode).toBe(400);
        }
    });

    it('should get an account by id', async () => {
        try {
            await getAccountById(4);
            assert.fail("should trigger a bad request error when account retrieval.");
        } catch (e) {
            expect(e.name).toBe('HttpBadRequest');
            expect(e.statusCode).toBe(400);
        }
    });

    it('should delete an account', async () => {
        try {
            await deleteAccountById(4);
            assert.fail("should trigger a bad request error when account deletion.");
        } catch (e) {
            expect(e.name).toBe('HttpBadRequest');
            expect(e.statusCode).toBe(400);
        }
    });

});

describe("Account Service with bad parameters", () => {
    it("should fail to create an account with invalid parameters", async () => {
        const invalidParameters = [
            { userId: "4", balance: "9999" },
            {},
        ];

        for (const params of invalidParameters) {
            try {
                await createAccount(params);
                expect.fail("Expected method to throw an HttpBadRequest due to invalid parameters.");
            } catch (e) {
                expect(e.name).toBe('HttpBadRequest');
                expect(e.statusCode).toBe(400);
            }
        }
    });

    it('should fail to delete an account with invalid parameters', async () => {
        try {
            await deleteAccountById("4");
            expect.fail("Expected method to throw an HttpBadRequest due to invalid parameters.");
        } catch (e) {
            expect(e.name).toBe('HttpBadRequest');
            expect(e.statusCode).toBe(400);
        }
    });

});