import dotenv from 'dotenv';
import logger from '../logger.js';
import nodemailer from 'nodemailer';

dotenv.config();

const sendEmail = async (user, emailData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: emailData.subject,
      html: emailData.html,
    });
  } catch (err) {
    logger.error(err);
  }
};

export default sendEmail;
