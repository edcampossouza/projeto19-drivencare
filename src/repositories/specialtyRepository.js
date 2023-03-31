import connectionDb from "../config/database.js";

async function getAll() {
  const result = await connectionDb.query(` SELECT * FROM specialty`);
  return result.rows;
}

export default {
  getAll,
};
