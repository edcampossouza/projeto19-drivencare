import connectionDb from "../config/database.js";

async function getAll() {
  const result = await connectionDb.query(` SELECT * FROM specialty`);
  return result.rows;
}

async function create(name) {
  await connectionDb.query(
    `
    INSERT INTO specialty (name)
    VALUES ($1)
  `,
    [name]
  );
}

export default {
  getAll,
  create,
};
