import Joi from "joi";

export const vacanciesQuerySchema = Joi.object({
  dayFrom: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
  dayTo: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
  specialty: Joi.number().integer().positive().required(),
});
