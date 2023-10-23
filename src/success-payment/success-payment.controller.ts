import {Body, Controller, Post} from '@nestjs/common';

@Controller('success')
export class SuccessPaymentController {

    @Post()
    async successPayment(@Body() dto: any) {
        console.log('dto successPayment', dto)
    }

}
