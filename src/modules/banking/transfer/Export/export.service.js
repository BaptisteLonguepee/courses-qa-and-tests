import * as xlsx from 'node-xlsx';
import * as fs from 'fs';
import { getTransfersInRepository } from '.././transfer.repository.js';

export async function createExport(accountId, filePath) {
    const transfers = await getTransfersInRepository(accountId);

    const data = [
        ['ID', 'Source Account ID', 'Destination Account ID', 'Amount'],
        ...transfers.map(transfer => [
            transfer.id,
            transfer.sourceAccountId,
            transfer.destAccountId,
            transfer.amount,
        ])
    ];

    const buffer = xlsx.build([{ name: 'Transfers', data }]);
    fs.writeFileSync(filePath, buffer);
    return filePath;
}