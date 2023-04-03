import Joi from "joi";

export const vacanciesQuerySchema = Joi.object({
  dayFrom: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  dayTo: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  specialty: Joi.number().integer().positive().required(),
});

export const appointmentInput = Joi.object({
  date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  begin: Joi.string()
    .regex(/^\d{2}:\d{2}$/)
    .required(),
  end: Joi.string()
    .regex(/^\d{2}:\d{2}$/)
    .required(),
  physician_id: Joi.number().integer().positive().required(),
  specialty_id: Joi.number().integer().positive().required(),
});
