import {sql} from "../../../infrastructure/db.js";

export async function createAccountInRepository({ userId, amount}) {
  const accounts = await sql`
    INSERT INTO accounts (userId, amount)
    VALUES (${userId}, ${amount})
    RETURNING *
    `;

  return accounts[0];
}

export async function getAccountByIdInRepository(id, userId, amount) {
  const accounts = await sql`
    SELECT * FROM accounts
    WHERE id = ${id} AND userId = ${userId} AND amount = ${amount}
    `;

  return accounts[0];
}

export async function deleteAccountByIdInRepository(id) {
  const accounts = await sql`
    DELETE FROM accounts
    WHERE id = ${id}
    RETURNING *
    `;

  return accounts[0];
}