import dotEnv from 'dotenv';
import path from 'path';

dotEnv.config({
  path: path.resolve(__dirname, '../../.env')
});

export default {
  APP: process.env.APP,
  PORT: process.env.PORT,

  DB_DIALECT: process.env.DB_DIALECT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  SALT_ROUNDS: process.env.SALT_ROUNDS,

  REDIRECT_URL: process.env.REDIRECT_URL,
  INVITATION_EXPIRATION_DAYS: process.env.INVITATION_EXPIRATION_DAYS,

  MAIL_SERVICE: process.env.MAIL_SERVICE,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_ACCOUT_TOKEN: process.env.TWILIO_ACCOUT_TOKEN,
  TWILIO_FROM_PHONE_NUMBER: process.env.TWILIO_FROM_PHONE_NUMBER,

  BRANCH_URL: process.env.BRANCH_URL,
  BRANCH_KEY: process.env.BRANCH_KEY,

  NODE_ENV: process.env.NODE_ENV
}