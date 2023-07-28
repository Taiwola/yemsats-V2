import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('home')
  @Render('index')
  root() {
    return;
  }
}
