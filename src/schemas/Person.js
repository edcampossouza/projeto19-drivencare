import joi from "joi";

export default joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required().min(6),
});

export const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
