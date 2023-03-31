import { Router } from "express";
import specialtyController from "../controllers/specialtyController.js";

const specialtyRoute = Router();

specialtyRoute.get("/", specialtyController.getAll);

export default specialtyRoute;
