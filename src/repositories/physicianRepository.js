import connectionDb from "../config/database.js";
import { buildWhereClause } from "../util/query.js";

async function findById(id) {
  const res = await find({ id });
  if (res.length === 0) return null;
  return res[0];
}

async function findByEmail(email) {
  const res = await find({ email, includePassHash: true });
  if (res.length === 0) return null;
  return res[0];
}

async function getAll() {
  return await find({});
}

async function find({
  id,
  email,
  includePassHash,
  specialty,
  location,
  name,
}) {
  const conditions = [];
  if (id) {
    conditions.push({ column: "physician.id", operator: "=", variable: id });
  }

  if (email) {
    conditions.push({
      column: "physician.email",
      operator: "=",
      variable: email,
    });
  }

  if (specialty) {
    conditions.push({
      column: "specialty",
      operator: "=",
      variable: `specialty`,
    });
  }

  if (name) {
    conditions.push({
      column: "physician.name",
      operator: "LIKE",
      variable: `%${name}%`,
    });
  }

  if (location) {
    conditions.push({
      column: "city",
      operator: "LIKE",
      variable: `%${location}%`,
    });
  }

  const { str, varArray } = buildWhereClause(conditions);
  const result = await connectionDb.query(
    `
    SELECT json_build_object(
      'id', physician.id,
      'name', physician.name,
      'email', email,
      'city', physician.city,
      'workWeek', json_build_object(
        'sunday', workweek.sunday,
        'monday', workweek.monday,
        'tuesday', workweek.tuesday,
        'wednesday', workweek.wednesday,
        'thursday', workweek.thursday,
        'friday', workweek.friday,
        'saturday', workweek.saturday
      ),
      'workHours', json_build_object(
        'begin', to_char(workday_begin, 'hh24:mi'),
        'end', to_char(workday_end, 'hh24:mi')
      ),
      'specialties', json_agg(json_build_object('id', specialty.id, 'name',specialty.name))
      ${includePassHash ? ",'password', physician.password" : ""}

      
      
    ) as physician
    
    FROM physician 
    JOIN workweek on workweek.physician_id = physician.id
    LEFT JOIN physician_specialty ON physician_specialty.physician_id = physician.id
    LEFT JOIN specialty on physician_specialty.specialty_id = specialty.id

    ${str}

    GROUP BY physician.id, physician.name, email, 
    workweek.sunday,
    workweek.monday,
    workweek.tuesday,
    workweek.wednesday,
    workweek.thursday,
    workweek.friday,
    workweek.saturday
    `,
    varArray
  );
  result.rows.forEach((row) => {
    row.physician.specialties = row.physician.specialties.filter(
      (s) => s.id !== null
    );
  });
  return result.rows;
}

async function create({ name, email, password, city, workHours, workWeek }) {
  const result = await connectionDb.query(
    `
        INSERT INTO physician (name, email, password, city, workday_begin, workday_end)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `,
    [
      name,
      email,
      password,
      city,
      workHours?.beginning || "08:00",
      workHours?.end || "18:00",
    ]
  );
  const physicianId = result.rows[0].id;
  // insert custom workweek
  if (workWeek) {
    await connectionDb.query(
      `
        INSERT INTO workweek (physician_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday)
        values ($1, $2, $3, $4, $5, $6, $7, $8)    
    `,
      [
        physicianId,
        workWeek.sunday,
        workWeek.monday,
        workWeek.tuesday,
        workWeek.wednesday,
        workWeek.thursday,
        workWeek.friday,
        workWeek.saturday,
      ]
    );
  }
  // insert default workweek from database
  else {
    await connectionDb.query(
      `
        INSERT INTO workweek (physician_id)
        values ($1)    
    `,
      [physicianId]
    );
  }
}

async function getPhysicianHours({ dayFrom, dayTo, specialty }) {
  const results = await connectionDb.query(
    `
    SELECT  json_build_object(
      'id', physician.id,
      'name', physician.name,
      "date", json_build_object(
        'hours', json_agg(json_build_object('begins', to_char(appointment.begins_at, 'hh24:mi'), 'ends',to_char(appointment.ends_at, 'hh24:mi')))
      ) 
      ) as date
    FROM
      physician JOIN physician_specialty ON physician_specialty.physician_id = physician.id
      JOIN appointment on appointment.physician_id = physician.id
    WHERE
      physician_specialty.specialty_id = $1
    AND 
      (appointment.date BETWEEN $2 AND $3)
    AND 
      (appointment.canceled_at is NULL)
    GROUP BY physician.id, physician.name, appointment.date, begins_at
    ORDER BY physician.id, appointment.date, begins_at

  `,
    [specialty, dayFrom, dayTo]
  );
  return results.rows;
}

async function getBySpecialty(specialty) {
  const results = await find({ specialty });
  return results;
}

async function addSpecialty({ physician_id, specialty_id }) {
  console.log(physician_id, specialty_id);
  await connectionDb.query(
    `
      INSERT INTO physician_specialty(physician_id, specialty_id)
      VALUES ($1, $2)
    `,
    [physician_id, specialty_id]
  );
}

async function bookAppointment({
  physician_id,
  date,
  begin,
  end,
  patient_id,
  specialty_id,
}) {
  await connectionDb.query(
    `
      INSERT INTO appointment (patient_id, physician_id, specialty_id, date, begins_at, ends_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [patient_id, physician_id, specialty_id, date, begin, end]
  );
}

async function getAppointmentById(id) {
  const results = await connectionDb.query(
    `
    SELECT *
    FROM appointment
    WHERE id = $1
  `,
    [id]
  );

  if (results.rowCount) return results.rows[0];
  return null;
}

async function cancelAppointment(appointment_id) {
  await connectionDb.query(
    `
    UPDATE appointment
    SET canceled_at = now()
    WHERE id = $1
    `,
    [appointment_id]
  );
}

async function confirmAppointment(appointment_id) {
  await connectionDb.query(
    `
    UPDATE appointment
    SET confirmed_at = now()
    WHERE id = $1
    `,
    [appointment_id]
  );
}

export default {
  findByEmail,
  findById,
  getAll,
  create,
  find,
  getPhysicianHours,
  getBySpecialty,
  addSpecialty,
  bookAppointment,
  getAppointmentById,
  cancelAppointment,
  confirmAppointment,
};
