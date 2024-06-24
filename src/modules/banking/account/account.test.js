import { describe, it, vi, expect, afterEach } from "vitest";
import * as repository from "./account.repository.js";
import { sql } from "../../../infrastructure/db.js";

vi.mock('../../../infrastructure/db.js', () => ({
    sql: vi.fn()
}));

describe("Account Repository", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should create an account in the repository", async () => {
        const mockAccount = { id: 1, userId: 1, amount: 1000 };
        sql.mockResolvedValueOnce([mockAccount]);

        const result = await repository.createAccountInRepository(mockAccount);
        expect(result).toEqual(mockAccount);
        expect(sql).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO accounts"), expect.anything());
    });

    it("should get an account by ID in the repository", async () => {
        const mockAccount = { id: 1, userId: 1, amount: 1000 };
        sql.mockResolvedValueOnce([mockAccount]);

        const result = await repository.getAccountByIdInRepository(1, 1, 1000);
        expect(result).toEqual(mockAccount);
        expect(sql).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM accounts"), expect.anything());
    });

    it("should delete an account by ID in the repository", async () => {
        const mockAccount = { id: 1 };
        sql.mockResolvedValueOnce([mockAccount]);

        const result = await repository.deleteAccountByIdInRepository(1);
        expect(result).toEqual(mockAccount);
        expect(sql).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM accounts"), expect.anything());
    });
});