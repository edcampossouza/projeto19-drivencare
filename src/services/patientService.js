import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import patientRepository from "../repositories/patientRepository.js";
import errors from "../errors/index.js";

dotenv.config();
const { JWT_SECRET_PATIENT } = process.env;

async function create({ email, password, name }) {
  const { rowCount } = await patientRepository.findByEmail(email);
  if (rowCount) throw errors.duplicatedEmailError(email);
  const passwordHash = bcrypt.hashSync(password, 10);
  await patientRepository.create({ email, password: passwordHash, name });
}

async function signin({ email, password }) {
  const {
    rowCount,
    rows: [user],
  } = await patientRepository.findByEmail(email);
  if (!rowCount) throw errors.invalidCredentialsError();

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) throw errors.invalidCredentialsError();

  const token = jwt.sign(user, JWT_SECRET_PATIENT);
  return { token };
}

async function appointments(patient_id) {
  return await patientRepository.appointments(patient_id);
}
export default { create, signin, appointments };
