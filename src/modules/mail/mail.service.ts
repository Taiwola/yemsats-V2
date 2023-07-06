import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendMail(email: string, resetLink: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'seunolanitori@gmail.com',
        subject: 'Reset Password Link for Your Account',
        html: `<p>Please click on the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
