import { Module } from '@nestjs/common';
import { SuccessPaymentService } from './success-payment.service';
import { SuccessPaymentController } from './success-payment.controller';

@Module({
  providers: [SuccessPaymentService],
  controllers: [SuccessPaymentController]
})
export class SuccessPaymentModule {}
