import { describe, it, vi, expect, afterEach } from "vitest";
import { createTransfer, getTransfers } from "./transfer.service.js";

vi.mock("./transfer.repository", async (importOriginal) => ({
    ...(await importOriginal()),
    createTransferInRepository: vi.fn((data) => {
        if (data.amount < 0) {
            throw new Error("Negative amount");
        }
        if (data.amount > 1000) { // Suppose we set a threshold for insufficient funds
            throw new Error("Insufficient funds");
        }
        return {
            id: 1,
            sourceAccountId: data.sourceAccountId,
            destAccountId: data.destAccountId,
            amount: data.amount,
        };
    }),
    getTransfersInRepository: vi.fn((userId) => {
        return [
            {
                id: 1,
                sourceAccountId: 1,
                destAccountId: 2,
                amount: 100,
            },
            {
                id: 2,
                sourceAccountId: 2,
                destAccountId: 3,
                amount: 200,
            }
        ];
    }),
}));

describe("Transfer Service", () => {
    afterEach(() => vi.clearAllMocks());

    it("should create a transfer", async () => {
        const transfer = await createTransfer({
            sourceAccountId: 1,
            destAccountId: 2,
            amount: 100,
        });
        expect(transfer).toHaveProperty("id");
        expect(transfer.sourceAccountId).toBe(1);
        expect(transfer.destAccountId).toBe(2);
        expect(transfer.amount).toBe(100);
    });

    it("should fail to create a transfer with invalid parameters", async () => {
        await expect(createTransfer({
            sourceAccountId: "invalid",
            destAccountId: 2,
            amount: 100,
        })).rejects.toThrow();
    });

    it("should fail to create a transfer with insufficient funds", async () => {
        await expect(createTransfer({
            sourceAccountId: 1,
            destAccountId: 2,
            amount: 10000,
        })).rejects.toThrow("Insufficient funds");
    });

    it("should fail to create a transfer with negative amount", async () => {
        await expect(createTransfer({
            sourceAccountId: 1,
            destAccountId: 2,
            amount: -100,
        })).rejects.toThrow("Negative amount");
    });

    it("should get transfers by user ID", async () => {
        const transfers = await getTransfers(1);
        expect(transfers.length).toBeGreaterThan(0);
        expect(transfers[0]).toHaveProperty("id");
        transfers.forEach(transfer => {
            expect(transfer).toHaveProperty("sourceAccountId");
            expect(transfer).toHaveProperty("destAccountId");
            expect(transfer).toHaveProperty("amount");
        });
    });

    it("should fail to get transfers with invalid user ID", async () => {
        await expect(getTransfers("invalid")).rejects.toThrow("Invalid user ID");
    });
});
