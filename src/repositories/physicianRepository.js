import connectionDb from "../config/database.js";

async function findByEmail(email) {
  return await connectionDb.query(
    `    
    SELECT * FROM physician WHERE email=$1
  `,
    [email]
  );
}

async function findById(id) {
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

      
      
    ) as physician
    
    FROM physician 
    JOIN workweek on workweek.physician_id = physician.id
    LEFT JOIN physician_specialty ON physician_specialty.physician_id = physician.id
    LEFT JOIN specialty on physician_specialty.specialty_id = specialty.id

    WHERE physician.id=$1
    GROUP BY physician.id, physician.name, email, 
    workweek.sunday,
    workweek.monday,
    workweek.tuesday,
    workweek.wednesday,
    workweek.thursday,
    workweek.friday,
    workweek.saturday
    `,
    [id]
  );
  if (result.rowCount === 0) return null;
  const physician = result.rows[0].physician;
  physician.specialties = physician.specialties.filter((s) => s.id !== null);
  console.log(physician);
  return physician;
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

export default {
  findByEmail,
  findById,
  create,
};
