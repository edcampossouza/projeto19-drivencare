import specialtyRepository from "../repositories/specialtyRepository.js";

async function getAll() {
  return await specialtyRepository.getAll();
}

async function create(name) {
  await specialtyRepository.create(name);
}

export default {
  getAll,
  create,
};
