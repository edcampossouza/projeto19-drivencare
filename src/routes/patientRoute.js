import { Router } from "express";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";
import PatientSchema from "../schemas/Patient.js";
import { signinSchema } from "../schemas/Person.js";
import patientController from "../controllers/patientController.js";

const patientRouter = Router();

patientRouter.post(
  "/signup",
  validateSchema(PatientSchema),
  patientController.signup
);

patientRouter.post(
  "/signin",
  validateSchema(signinSchema),
  patientController.signin
);

export default patientRouter;
