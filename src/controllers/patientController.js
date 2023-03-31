import patientService from "../services/patientService.js";

async function signup(req, res, next) {
  const { email, password, name } = req.body;

  try {
    await patientService.create({ email, password, name });
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function signin(req, res, next) {
  const { email, password } = req.body;
  try {
    const token = await patientService.signin({ email, password });
    return res.status(200).send(token);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
export default { signup, signin };
