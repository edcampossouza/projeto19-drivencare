import bcrypt from "bcrypt";
import patientRepository from "../repositories/patientRepository.js";
import errors from "../errors/index.js";

async function create({ email, password, name }) {
  const { rowCount } = await patientRepository.findByEmail(email);
  if (rowCount) throw errors.duplicatedEmailError(email);
  const passwordHash = bcrypt.hashSync(password, 10);
  await patientRepository.create({ email, password: passwordHash, name });
}

export default { create };
