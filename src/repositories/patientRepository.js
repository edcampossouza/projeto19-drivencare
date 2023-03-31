import connectionDb from "../config/database.js";

async function findByEmail(email) {
  const results = await connectionDb.query(
    `
        SELECT * FROM patient where email = $1
    `,
    [email]
  );

  return results;
}

async function create({ email, name, password }) {
  await connectionDb.query(
    `
        INSERT INTO patient (email, name, password)
        VALUES ($1, $2, $3)
    `,
    [email, name, password]
  );
}

export default { findByEmail, create };
