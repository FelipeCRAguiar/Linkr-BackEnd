import joi from "joi";

const editPostSchema = joi.object({
  text: joi.string().required(),
});

export default editPostSchema;
