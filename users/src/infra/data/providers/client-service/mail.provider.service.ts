import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ResultModel } from 'src/core/result.mode';
import {EmailDto} from 'src/application/dtos'

@Injectable()
export class MailProviderService {
      constructor(
         @Inject('notification-service') private readonly mailService: ClientProxy,
      ) { }
   
      async sendEmail(emailDto: EmailDto): Promise<ResultModel<boolean>> {
         return await this.mailService.connect().then(async () => {
            const sendMail = await this.mailService
               .send<ResultModel<boolean>, EmailDto>({ cmd: 'send-mail' }, emailDto)
               .toPromise();

            return sendMail
         },
            (e) => {
               console.log('====================================');
               console.log('emailDto error: ', e);
               console.log('====================================');
               return new ResultModel<boolean>(false, ['mail service unavaible']);
            });
      }
}