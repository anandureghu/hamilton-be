import Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('develop', 'production').default(['develop']),
  PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_MAX_CONNECTIONS: Joi.number().required(),
  PROJECT_NAME: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  CALLBACK_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
