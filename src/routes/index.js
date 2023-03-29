import { Router } from "express";
import physicianRouter from "./physicianRoute.js";

const routes = Router();

routes.use("/physician", physicianRouter);

export default routes;
