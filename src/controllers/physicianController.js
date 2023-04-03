import physicianService from "../services/physicianService.js";

async function create(req, res, next) {
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
    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function signin(req, res, next) {
  const { email, password } = req.body;
  try {
    const token = await physicianService.signin({ email, password });
    return res.send(token);
  } catch (error) {
    console.log(error);
    next(error);
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
    next(err);
  }
}

async function getVacancies(req, res, next) {
  const { dayFrom, dayTo, specialty } = req.query;

  try {
    const response = await physicianService.getVacancies({
      dayFrom,
      dayTo,
      specialty,
    });
    return res.send(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function postSpecialty(req, res, next) {
  const { specialty_id } = req.body;
  const { id: physician_id } = res.locals.physician;
  try {
    await physicianService.postSpecialty({ physician_id, specialty_id });
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export default {
  create,
  get,
  getAll,
  getBySpecialty,
  signin,
  getVacancies,
  postSpecialty,
};
