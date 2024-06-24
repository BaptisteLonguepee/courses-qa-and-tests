import { describe, it, vi, expect, afterEach } from "vitest";
import { createExport } from "./export.service.js";
import * as xlsx from 'node-xlsx';
import * as fs from 'fs';
import { getTransfersInRepository } from '.././transfer.repository.js';

// Mock node-xlsx
vi.mock('node-xlsx', () => ({
    build: vi.fn(),
}));

// Mock fs
vi.mock('fs', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        writeFileSync: vi.fn(),
    };
});

// Mock transfer.repository.js
vi.mock('.././transfer.repository.js', () => ({
    getTransfersInRepository: vi.fn(() => [
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
    ]),
}));

describe("Export Service", () => {
    afterEach(() => vi.clearAllMocks());

    it("should create an export file", async () => {
        const mockBuffer = Buffer.from('mock data');
        vi.mocked(xlsx.build).mockReturnValue(mockBuffer);

        const filePath = './transfers.xlsx';
        const result = await createExport(1, filePath);

        expect(result).toBe(filePath);
        expect(xlsx.build).toHaveBeenCalledWith([{
            name: 'Transfers',
            data: [
                ['ID', 'Source Account ID', 'Destination Account ID', 'Amount'],
                [1, 1, 2, 100],
                [2, 2, 3, 200],
            ],
        }]);
        expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, mockBuffer);
    });
});
