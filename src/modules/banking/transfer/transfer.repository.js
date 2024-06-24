import { sql } from "../../../infrastructure/db.js";

export async function createTransferInRepository({ sourceAccountId, destAccountId, amount }) {
    const client = await sql.begin();
    try {
        const sourceAccount = await client`
      SELECT amount FROM accounts WHERE id = ${sourceAccountId}
    `;
        if (sourceAccount[0].amount < amount) {
            throw new Error('Insufficient funds');
        }

        await client`
      UPDATE accounts SET amount = amount - ${amount} WHERE id = ${sourceAccountId}
    `;
        await client`
      UPDATE accounts SET amount = amount + ${amount} WHERE id = ${destAccountId}
    `;

        const transfer = await client`
      INSERT INTO transfers (sourceAccountId, destAccountId, amount)
      VALUES (${sourceAccountId}, ${destAccountId}, ${amount})
      RETURNING *
    `;

        await client.commit();
        return transfer[0];
    } catch (error) {
        await client.rollback();
        throw error;
    }
}

export async function getTransfersInRepository(userId) {
    const transfers = await sql`
    SELECT t.id, t.sourceAccountId, t.destAccountId, t.amount
    FROM transfers t
    JOIN accounts a ON t.sourceAccountId = a.id OR t.destAccountId = a.id
    WHERE a.userId = ${userId}
  `;
    return transfers;
}
