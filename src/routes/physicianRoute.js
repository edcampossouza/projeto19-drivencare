import { Router } from "express";
import physicianController from "../controllers/physicianController.js";
import { validateSchema } from "../middlewares/authMiddleware.js";
import PhysicianSchema from "../schemas/Physician.js";

const physicianRouter = Router();

physicianRouter.post(
  "/",
  validateSchema(PhysicianSchema),
  physicianController.create
);

export default physicianRouter;
