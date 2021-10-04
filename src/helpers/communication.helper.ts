import axios from 'axios';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import twilio from 'twilio';
import path from 'path';
import logger from '../utils/logger';
import config from '../config/config';

const { MAIL_SERVICE, MAIL_HOST, MAIL_USER, MAIL_PASSWORD, TWILIO_ACCOUNT_SID, TWILIO_ACCOUT_TOKEN, TWILIO_FROM_PHONE_NUMBER } = config;

//TODO: parameter this
const transport = nodemailer.createTransport({
    service: MAIL_SERVICE,
    host: MAIL_HOST,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

//TODO: improve
const mailOptions = {
    from: '"Conneqt - Cardiex" <conneqt.test@gmail.com>',
    to: '',
    subject: '',
    html: ''
};

export const sendInvitationMail = (link: string, code: number, to: string) => {
    const emailTemplateSource = fs.readFileSync(path.join(__dirname, "mail-templates/invitation-template.hbs"), "utf8");
    const template = handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ link, code });
    mailOptions.html = htmlToSend;
    mailOptions.to = to;
    mailOptions.subject = 'Welcome to Conneqt - Subscription';
    transport.sendMail(mailOptions, (error) => {
        if (error?.message) {
            logger.error(error);
            throw Error('Something went wrong sending the email');
        }
    });
};

const generateDeepLink = async (data: object) => {
    try {
        const res = await axios.post(config.BRANCH_URL!, {
            branch_key: config.BRANCH_KEY,
            type: 1,
            data,
        });
        return res.data.url;
    } catch (error) {
        throw new Error(error);
    }
}
export const sendResetPasswordMail = async (to: string, userId: number, resetGuid: string) => {
    const deeplink = await generateDeepLink({
        userId,
        navigateTo: 'reset_password',
        resetGuid,
    });
    const emailTemplateSource = fs.readFileSync(path.join(__dirname, 'mail-templates/reset-password-template.hbs'), 'utf-8');
    const template = handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ link: deeplink });
    mailOptions.html = htmlToSend;
    mailOptions.to = to;
    mailOptions.subject = 'Conneqt - Reset Password';
    transport.sendMail(mailOptions, (error) => {
        if(error?.message) {
            logger.error(error);
            throw Error('Something went wrong sendind the email');
        };
    });
};

/**
 * 
 * @param phoneNumber 
 * @param code 
 * Sends a SMS to the given phone number with the given code. Using Twilio.
 */
export const sendCodeSMS = async (phoneNumber: string, code: string) => {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_ACCOUT_TOKEN);
    await client.messages.create({
        to: phoneNumber,
        from: TWILIO_FROM_PHONE_NUMBER,
        body: `[TWILIO-DEV] This is your authentication code: ${code}.`
    });
};