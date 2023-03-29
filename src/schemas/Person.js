import joi from "joi";

export default joi.object({
  name: joi.string().required(),
  email: joi.email().required(),
  password: joi.string().required().min(6),
});
