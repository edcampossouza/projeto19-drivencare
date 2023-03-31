import { Router } from "express";
import physicianController from "../controllers/physicianController.js";
import { validateSchema } from "../middlewares/authMiddleware.js";
import PhysicianSchema from "../schemas/Physician.js";

const physicianRouter = Router();

physicianRouter.post(
  "/signup",
  validateSchema(PhysicianSchema),
  physicianController.create
);

physicianRouter.get("/:id", physicianController.get);
physicianRouter.get("/", physicianController.getAll);
physicianRouter.get("/specialties", physicianController.getBySpecialty);

export default physicianRouter;
