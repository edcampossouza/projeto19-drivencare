import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import physicianRepository from "../repositories/physicianRepository.js";
import errors from "../errors/index.js";

dotenv.config();
const { JWT_SECRET_PHYSICIAN } = process.env;

// returns true on success

async function create({ name, email, password, city, workHours, workWeek }) {
  const { rowCount } = await physicianRepository.findByEmail(email);
  if (rowCount) throw errors.duplicatedEmailError(email);
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

async function getBySpecialty(req, res) {
  const { searchKey } = req.query;
  try {
    const results = await physicianService.getBySpecialty(searchKey);
    return res.status(200).send(results);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

async function signin({ email, password }) {
  const result = await physicianRepository.findByEmail(email);
  if (!result) throw errors.invalidCredentialsError();
  const { physician } = result;
  const isValidPassword = bcrypt.compareSync(password, physician.password);
  if (!isValidPassword) throw errors.invalidCredentialsError();
  const token = jwt.sign(physician, JWT_SECRET_PHYSICIAN);
  return token;
}

export default {
  create,
  get,
  getAll,
  getBySpecialty,
  signin,
};
