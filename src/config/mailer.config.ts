import { createTransport, Transporter } from 'nodemailer';

export const transporter: Transporter = createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.AUTH_USER,
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    refreshToken: process.env.AUTH_REFRESH_TOKEN,
    accessToken: process.env.AUTH_ACCESS_TOKEN,
  },
});

export const mailerConfig = {
  transport: transporter,
};
