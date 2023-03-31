import specialtyService from "../services/specialtyService.js";

async function getAll(_, res, next) {
  try {
    const result = await specialtyService.getAll();
    return res.status(200).send(result);
  } catch (error) {
    next(error);
    console.log(error);
  }
}

export default {
  getAll,
};
