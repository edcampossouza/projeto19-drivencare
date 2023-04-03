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

async function appointments(patient_id) {
  return (
    await connectionDb.query(
      `
    SELECT json_build_object(
      'id', appointment.id,
      'date', appointment.date,
      'from', appointment.begins_at,
      'to', appointment.ends_at,
      'specialty', specialty.name,
      'confirmed_at', date_trunc('minute', appointment.confirmed_at),
      'physician', json_build_object(
        'id', physician.id,
        'name', physician.name
      )
    ) as appointment
      
    
    FROM patient JOIN appointment on appointment.patient_id = patient.id
    JOIN physician on physician.id = appointment.physician_id
    JOIN specialty on specialty.id = appointment.specialty_id

    WHERE patient.id = $1
    AND canceled_at IS NULL
  `,
      [patient_id]
    )
  ).rows;
}

export default { findByEmail, create, isAvailable, appointments };
