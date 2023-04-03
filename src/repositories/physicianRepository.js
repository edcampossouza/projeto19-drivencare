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

async function find({ id, email, includePassHash, specialty }) {
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
      column: "specialty.id",
      operator: "=",
      variable: specialty,
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
        'begin', date_trunc('minute', workday_begin),
        'end', date_trunc('minute', workday_end)
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
        'hours', json_agg(json_build_object('begins', appointment.begins_at, 'ends',appointment.ends_at))
      ) 
      ) as date
    FROM
      physician JOIN physician_specialty ON physician_specialty.physician_id = physician.id
      JOIN appointment on appointment.physician_id = physician.id
    WHERE
      physician_specialty.specialty_id = $1
    AND 
      (appointment.date BETWEEN $2 AND $3)
    GROUP BY physician.id, physician.name, appointment.date

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
  console.log(physician_id, specialty_id)
  await connectionDb.query(
    `
      INSERT INTO physician_specialty(physician_id, specialty_id)
      VALUES ($1, $2)
    `,
    [physician_id, specialty_id]
  );
}

export default {
  findByEmail,
  findById,
  getAll,
  create,
  getPhysicianHours,
  getBySpecialty,
  addSpecialty,
};
