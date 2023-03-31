import specialtyRepository from "../repositories/specialtyRepository.js";

async function getAll() {
  return await specialtyRepository.getAll();
}

export default {
  getAll,
};
