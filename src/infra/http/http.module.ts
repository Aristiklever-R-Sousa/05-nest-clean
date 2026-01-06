import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionController } from './controllers/create-question.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController],
  providers: [CreateQuestionUseCase],
})
export class HttpModule { }
