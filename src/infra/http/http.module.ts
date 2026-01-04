import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { DatabaseModule } from '@faker-js/faker'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [],
})
export class HttpModule { }
