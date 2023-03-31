import physicianService from "../services/physicianService.js";

async function create(req, res) {
  const { name, email, password, city, workHours, workWeek } = req.body;

  try {
    const success = await physicianService.create({
      name,
      email,
      password,
      city,
      workHours,
      workWeek,
    });
    if (success) return res.sendStatus(201);
    else return res.status(409).send("Email já está cadastrado");
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

async function get(req, res) {
  const { id } = req.params;

  try {
    const result = await physicianService.get(id);
    if (result) return res.status(200).send(result);
    else return res.status(404).send("Não encontrado");
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

async function getAll(_, res) {
  try {
    const results = await physicianService.getAll();
    return res.status(200).send(results);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
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

export default {
  create,
  get,
  getAll,
  getBySpecialty,
};
