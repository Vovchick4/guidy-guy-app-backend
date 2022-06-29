import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ConfirmEmailDto } from './confirmEmail.dto';
import { EmailConfirmationService } from './emailConfirmation.service';
import JwtAuthenticationGuard from '../auth/jwt.auth.guard';
import { User } from '../users/users.entity';
// import RequestWithUser from '../authentication/requestWithUser.interface';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  private readonly emailConfirmationService: EmailConfirmationService

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthenticationGuard)
  async resendConfirmationLink(@Req() request: User) {
    await this.emailConfirmationService.resendConfirmationLink(request.id);
  }

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
    await this.emailConfirmationService.confirmEmail(email);
  }
}