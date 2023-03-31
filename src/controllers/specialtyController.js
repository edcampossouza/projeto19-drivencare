import specialtyService from "../services/specialtyService.js";

async function getAll(_, res) {
  try {
    const result = await specialtyService.getAll();
    return res.status(200).send(result);
  } catch (error) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export default {
  getAll,
};
