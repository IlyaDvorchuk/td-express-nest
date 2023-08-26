import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from 'express';


@Controller('payment-callback')
export class PaymentCallbackController {
  @Post()
  handlePaymentCallback(@Body() callbackData: any, @Res() res: Response) {
    // const { status, paymentsum, paymentcurrency, invoiceid, date, signature, istest } = callbackData;

    console.log('callbackData', callbackData);
    // Проверка подписи и обработка данных в зависимости от статуса оплаты (success или fail)
    // Реализуйте здесь логику обработки оповещения и обновления статуса заказа в вашей базе данных

    return res.status(200).send('OK')
  }
}
