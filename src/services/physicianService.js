import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import dayjs from "dayjs";

import physicianRepository from "../repositories/physicianRepository.js";
import patientRepository from "../repositories/patientRepository.js";
import errors from "../errors/index.js";
import { integerToDateString, sliceHours } from "../util/dates.js";

dotenv.config();
const { JWT_SECRET_PHYSICIAN } = process.env;

// returns true on success

async function create({ name, email, password, city, workHours, workWeek }) {
  const results = await physicianRepository.findByEmail(email);
  if (results) throw errors.duplicatedEmailError(email);
  const hashPassword = await bcrypt.hash(password, 10);
  await physicianRepository.create({
    name,
    email,
    password: hashPassword,
    city,
    workHours,
    workWeek,
  });
}

async function get(id) {
  const physician = await physicianRepository.findById(id);
  return physician;
}

async function getAll() {
  const physicians = await physicianRepository.getAll();
  return physicians;
}

// async function getBySpecialty(req, res) {
//   const { searchKey } = req.query;
//   try {
//     const results = await physicianService.getBySpecialty(searchKey);
//     return res.status(200).send(results);
//   } catch (err) {
//     console.log(err);
//     return res.sendStatus(500);
//   }
// }

async function signin({ email, password }) {
  const result = await physicianRepository.findByEmail(email);
  if (!result) throw errors.invalidCredentialsError();
  const { physician } = result;
  const isValidPassword = bcrypt.compareSync(password, physician.password);
  if (!isValidPassword) throw errors.invalidCredentialsError();
  const token = jwt.sign(physician, JWT_SECRET_PHYSICIAN);
  return token;
}

async function getVacancies({ dayFrom, dayTo, specialty }) {
  const hours = await physicianRepository.getPhysicianHours({
    dayFrom,
    dayTo,
    specialty,
  });
  const docs = await physicianRepository.getBySpecialty(specialty);
  const startDate = dayjs(dayFrom);
  const endDate = dayjs(dayTo);
  const vacancies = {};

  for (
    let date = startDate;
    !date.isAfter(endDate, "day");
    date = date.add(1, "day")
  ) {
    const dowString = integerToDateString(date.day());
    const dateStr = date.format("YYYY-MM-DD");

    // lists physicians that are working on this day of the week
    const workingToday = docs.filter(
      (doc) => doc.physician.workWeek[dowString]
    );
    for (const physician of workingToday) {
      const physId = physician.physician.id;
      const hoursThisDay = hours
        .map((obj) => obj.date)
        .filter((dt) => dt[dateStr] && dt.id === physId)
        .reduce((p, c) => [...p, ...c[dateStr].hours], []);
      const hoursAvailable = sliceHours(
        {
          startHour: physician.physician.workHours.begin,
          endHour: physician.physician.workHours.end,
        },
        hoursThisDay
      );
      if (vacancies[physId]) {
        if (vacancies[physId].dates[dateStr]) {
          vacancies[physId].dates[dateStr].push(...hoursAvailable);
        } else {
          vacancies[physId].dates.push({ [dateStr]: hoursAvailable });
        }
      } else {
        vacancies[physId] = {
          physician: physician.physician,
          dates: [{ [dateStr]: hoursAvailable }],
        };
      }
    }
  }

  return vacancies;
}

async function postSpecialty({ physician_id, specialty_id }) {
  await physicianRepository.addSpecialty({ physician_id, specialty_id });
}

async function bookAppointment({
  physician_id,
  date,
  begin,
  end,
  patient_id,
  specialty_id,
}) {
  if (begin >= end)
    throw errors.dateError(`Invalide appointment time: ${begin} to ${end}`);

  // patient availability
  const patientAvailability = await patientRepository.isAvailable({
    physician_id,
    date,
    begin,
    end,
    patient_id,
  });

  if (patientAvailability)
    throw errors.conflictError(
      `Patient has a conflicting appointment: ${JSON.stringify(
        patientAvailability[0]
      )}`
    );

  // physician availability
  const physResult = await physicianRepository.findById(physician_id);
  if (!physResult)
    throw errors.notFoundError(`Invalid physician id: ${physician_id}`);
  const physician = physResult.physician;

  const dateJS = dayjs(date);
  const dowString = integerToDateString(dateJS.day());
  if (!physician.workWeek[dowString])
    throw errors.conflictError(
      `${physician.name} does not work on ${dowString}s`
    );

  const { workHours } = physician;
  if (begin < workHours.begin || end > workHours.end) {
    throw errors.conflictError(
      `${physician.name} only works from ${workHours.begin} to ${workHours.end}`
    );
  }
  if (!physician.specialties.map((s) => s.id).includes(specialty_id)) {
    throw errors.conflictError(`${physician.name} dos not have that specialty`);
  }

  const _vacancies = await getVacancies({
    dayFrom: date,
    dayTo: date,
    specialty: specialty_id,
  });
  const vacancyDate = _vacancies[physician.id].dates.find((x) => x[date]);
  console.log(vacancyDate[date]);
  if (
    vacancyDate[date].find(
      (interval) => interval.begins <= begin && interval.ends >= end
    )
  ) {
    await physicianRepository.bookAppointment({
      physician_id,
      date,
      begin,
      end,
      patient_id,
      specialty_id,
    });
  } else {
    throw errors.conflictError(`Physician not available at this time`);
  }
}

export default {
  create,
  get,
  getAll,
  // getBySpecialty,
  signin,
  getVacancies,
  postSpecialty,
  bookAppointment,
};
