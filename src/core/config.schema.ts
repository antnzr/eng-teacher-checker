import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  DEFAULT_SLEEP_SECONDS: Joi.string().required(),
  TELEGRAM_CHAT_ID: Joi.string().optional(),
  TELEGRAM_BOT_TOKEN: Joi.string().optional(),
});
