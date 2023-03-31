import { Router } from "express";
import physicianRouter from "./physicianRoute.js";
import specialtyRoute from "./specialtiesRoute.js";

const routes = Router();

routes.use("/physician", physicianRouter);
routes.use("/specialty", specialtyRoute);

export default routes;
