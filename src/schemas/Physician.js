import joi from "joi";
import PersonSchema from "./Person.js";

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

export default joi.object({
  ...PersonSchema,
  city: joi.string(),
  workHours: WorkHoursSchema,
  workWeek: WorkWeekSchema,
});
