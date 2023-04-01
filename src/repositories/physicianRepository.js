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

async function find({ id, email, includePassHash }) {
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

async function getVacancies() {}

export default {
  findByEmail,
  findById,
  getAll,
  create,
  getVacancies,
};
