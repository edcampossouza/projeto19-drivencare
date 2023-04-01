import { Router } from "express";
import physicianController from "../controllers/physicianController.js";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";
import PhysicianSchema from "../schemas/Physician.js";
import { signinSchema } from "../schemas/Person.js";
import { vacanciesQuerySchema } from "../schemas/Appointment.js";

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
  validateSchema(vacanciesQuerySchema, { source: "query" }),
  physicianController.getVacancies
);

physicianRouter.get("/:id", physicianController.get);

physicianRouter.get("/", physicianController.getAll);

export default physicianRouter;
