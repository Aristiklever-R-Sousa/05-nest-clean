import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { StudentFactory } from 'test/factories/make-student'

describe('Comment on Answer (e2e)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let answerFactory: AnswerFactory
    let jwt: JwtService
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, AnswerFactory]
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        answerFactory = moduleRef.get(AnswerFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[POST] /answers/:answerId/comments', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const answer = await answerFactory.makePrismaAnswer({
            authorId: user.id,
        })

        const answerId = answer.id.toString()

        const response = await request(app.getHttpServer())
            .post(`/answers/${answerId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                content: 'New comment',
            })

        expect(response.statusCode).toBe(201)

        const commentOnDatabase = await prisma.comment.findFirst({
            where: {
                content: 'New comment',
            }
        })

        expect(commentOnDatabase).toBeTruthy()
    })
})
