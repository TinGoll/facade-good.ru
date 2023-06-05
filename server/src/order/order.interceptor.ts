import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import handlebars from 'handlebars';
import { ORDER_TEMPLATE } from './templates/order-template';

@Injectable()
export class OrderInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const formData = request.body;
    const files = request.files;

    const header = JSON.parse(formData.header || '{}');
    const facades = JSON.parse(formData.facades || '[]');
    const accessories = JSON.parse(formData.accessories || '[]');

    const data: Order.Data = {
      header,
      facades,
      accessories,
      files,
    };

    const html$ = this.convertToHTML(data).pipe(
      catchError((error) => {
        console.error('Ошибка при конвертации данных в HTML:', error);
        throw new HttpException(
          'Ошибка при конвертации данных в HTML',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );

    return html$.pipe(
      switchMap((html) => this.sendEmail(html, files)),
      tap(() => {
        console.log('Письмо успешно отправлено');
      }),
      switchMap(() => next.handle()),
      catchError((error) => {
        console.error('Ошибка при отправке письма:', error);
        throw new HttpException(
          'Ошибка при отправке письма',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  convertToHTML(formData: Order.Data): Observable<string> {
    const template = handlebars.compile(ORDER_TEMPLATE);
    const html = template(formData);
    return of(html);
  }

  sendEmail(html: string, files: any[]): Observable<void> {
    const host = process.env.SMPT_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_USER;
    const to = process.env.EMAIL_COMPANY;

    console.log("host >>",host);
    console.log("port >>",port);
    console.log("user >>",user);
    console.log("pass >>",pass);
    console.log("from >>",from);
    console.log("to >>",to);
    

    const options = {
      service: 'gmail',
      port: 465,
      secure: true,
      logger: true,
      debug: true,
      secureConnection: false,
      auth: {
        user: 'facade.good.ru@gmail.com',
        pass: 'pwcjlkkipcgrjijs',
      },
      tls: {
        rejectUnAuthorized: true,
      },
    } as any;

    const transporter = nodemailer.createTransport(options);

    console.log('host', (transporter.options as any).host);
    console.log('options', transporter.options as any);

    const mailOptions = {
      from: `From <${`facade.good.ru@gmail.com`}>`,
      to: "roma.oliynyk83@gmail.com",
      subject: 'Заказ мебельных фасадов',
      html: html,
      attachments: files.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
      })),
    };

    return new Observable<void>((observer) => {
      transporter.sendMail(mailOptions, (error, info) => {
        console.log(error, info);
        if (error) {
          console.error('Ошибка при отправке письма:', error);
          observer.error(error);
        } else {
          console.log('Письмо успешно отправлено:', info.response);
          observer.next();
          observer.complete();
        }
      });
    });
  }
}