import { Router } from "express";
import physicianRouter from "./physicianRoute.js";
import specialtyRoute from "./specialtiesRoute.js";
import patientRouter from "./patientRoute.js";

const routes = Router();

routes.use("/physician", physicianRouter);
routes.use("/specialty", specialtyRoute);
routes.use("/patient", patientRouter);

export default routes;
