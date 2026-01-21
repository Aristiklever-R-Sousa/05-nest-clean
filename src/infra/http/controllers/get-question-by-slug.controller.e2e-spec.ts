import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'
import { StudentFactory } from 'test/factories/make-student'

describe('Get Question By Slug (e2e)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory
    let questionAttachmentFactory: QuestionAttachmentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory]
        }).compile()

        app = moduleRef.createNestApplication()

        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
        attachmentFactory = moduleRef.get(AttachmentFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent({ name: 'Jhon Doe' })

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            slug: Slug.create('question-01'),
            authorId: new UniqueEntityId(user.id.toString()),
        })

        const attachment = await attachmentFactory.makePrismaAttachment({
            title: 'Some attachment',
        })

        await questionAttachmentFactory.makePrismaQuestionAttachment({
            attachmentId: attachment.id,
            questionId: question.id
        })

        const response = await request(app.getHttpServer())
            .get('/questions/question-01')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            question: expect.objectContaining({
                slug: 'question-01',
                authorName: user.name,
                attachments: [
                    expect.objectContaining({
                        title: attachment.title,
                    })
                ]
            })
        })
    })
})
