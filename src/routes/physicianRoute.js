import { Router } from "express";
import physicianController from "../controllers/physicianController.js";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";
import PhysicianSchema, { postSpecialtySchema } from "../schemas/Physician.js";
import { signinSchema } from "../schemas/Person.js";
import {
  appointmentInput,
  vacanciesQuerySchema,
} from "../schemas/Appointment.js";
import { patientAuth, physicianAuth } from "../middlewares/authMiddleware.js";

const physicianRouter = Router();

physicianRouter.post(
  "/signup",
  validateSchema(PhysicianSchema),
  physicianController.create
);

physicianRouter.post(
  "/signin",
  validateSchema(signinSchema),
  physicianController.signin
);

physicianRouter.get(
  "/vacancies",
  patientAuth,
  validateSchema(vacanciesQuerySchema, { source: "query" }),
  physicianController.getVacancies
);

physicianRouter.post(
  "/specialties",
  physicianAuth,
  validateSchema(postSpecialtySchema),
  physicianController.postSpecialty
);

physicianRouter.post(
  "/appointments",
  patientAuth,
  validateSchema(appointmentInput),
  physicianController.bookAppointment
);

physicianRouter.post(
  "/appointments/:id/cancel",
  physicianAuth,
  physicianController.cancelAppointment
);

physicianRouter.get("/:id", physicianController.get);

physicianRouter.get("/", physicianController.getAll);

export default physicianRouter;
