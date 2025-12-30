import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { PrismaService } from '../prisma/prisma.service'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class HttpModule { }
