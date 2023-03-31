import bcrypt from "bcrypt";

import physicianRepository from "../repositories/physicianRepository.js";

// returns true on success

async function create({ name, email, password, city, workHours, workWeek }) {
  const { rowCount } = await physicianRepository.findByEmail(email);
  console.log(rowCount);
  if (rowCount) return false;
  const hashPassword = await bcrypt.hash(password, 10);
  await physicianRepository.create({
    name,
    email,
    password: hashPassword,
    city,
    workHours,
    workWeek,
  });
  return true;
}

async function get(id) {
  const physician = await physicianRepository.findById(id);
  return physician;
}

export default {
  create,
  get,
};
