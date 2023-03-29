import Joi from "joi";
import joiDate from "@joi/date";
import PersonSchema from "./Person.js";

const joi = Joi.extend(joiDate);

const WorkWeekSchema = joi.object({
  sunday: joi.boolean().required(),
  monday: joi.boolean().required(),
  tuesday: joi.boolean().required(),
  wednesday: joi.boolean().required(),
  thursday: joi.boolean().required(),
  friday: joi.boolean().required(),
  saturday: joi.boolean().required(),
});

const WorkHoursSchema = joi.object({
  beginning: joi.date().format("HH:mm").required(),
  end: joi.date().format("HH:mm").required(),
});

export default PersonSchema.keys({
  city: joi.string().required(),
  workHours: WorkHoursSchema,
  workWeek: WorkWeekSchema,
});
