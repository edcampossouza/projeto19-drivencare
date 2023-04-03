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

// checks if patient is available at the given time interval
//(i.e. they dont have any noncanceled appointments)
//returns: null if no apppointments
//         array of appointments otherwise
async function isAvailable({ patient_id, date, begin, end }) {
  const results = await connectionDb.query(
    `
    SELECT begins_at begins, ends_at ends 
    FROM appointment
    WHERE patient_id = $1
    AND date = $2
    AND 
     (
      (begins_at < $3 AND ends_at > $3) OR  (begins_at < $4 AND ends_at > $4)
     )
    AND canceled_at IS NULL
    `,
    [patient_id, date, begin, end]
  );
  if (results.rowCount) return results.rows;
  else return null;
}

export default { findByEmail, create, isAvailable };
