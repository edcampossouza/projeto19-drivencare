import { Router } from "express";
import specialtyController from "../controllers/specialtyController.js";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";
import Specialty from "../schemas/Specialty.js";

const specialtyRoute = Router();

specialtyRoute.get("/", specialtyController.getAll);
specialtyRoute.post("/", validateSchema(Specialty), specialtyController.create);

export default specialtyRoute;
