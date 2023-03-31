import { Router } from "express";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";
import PatientSchema from "../schemas/Patient.js";
import patientController from "../controllers/patientController.js";

const patientRouter = Router();

patientRouter.post(
  "/signup",
  validateSchema(PatientSchema),
  patientController.signup
);

export default patientRouter;
