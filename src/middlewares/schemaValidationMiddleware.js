export function validateSchema(schema, option) {
  return (req, res, next) => {
    const data = option?.source === "query" ? req.query : req.body;
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      return res
        .status(422)
        .send(error.details.map((detail) => detail.message));
    }
    next();
  };
}
