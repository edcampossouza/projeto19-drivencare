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

export default {
  create,
};
