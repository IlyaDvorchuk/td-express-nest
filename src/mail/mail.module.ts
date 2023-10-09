import { Global, Module } from "@nestjs/common";
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { UsersModule } from "../users/users.module";
import {SheltersModule} from "../shelters/shelters.module";

@Global()
@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        },
        defaults: {
          from: `"Td Market" <${process.env.SMTP_USER}>`,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    UsersModule,
      SheltersModule
  ]
})
export class MailModule {}
