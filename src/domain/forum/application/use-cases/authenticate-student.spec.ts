import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Register Student', () => {
    beforeEach(() => {
        inMemoryStudentsRepository =
            new InMemoryStudentsRepository()
        fakeHasher = new FakeHasher
        fakeEncrypter = new FakeEncrypter

        sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter)
    })

    it('should be able to authenticate a student', async () => {
        const student = makeStudent({
            email: "john.doe@example.com",
            password: await fakeHasher.hash("securePassword123")
        })

        inMemoryStudentsRepository.items.push(student)

        const result = await sut.execute({
            email: "john.doe@example.com",
            password: "securePassword123"
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toEqual({
            accessToken: expect.any(String),
        })
    })
})
