import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    const result = this.getHello();
    Logger.log(`Result from getHello: ${result}`);
  }
}
