import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

let sut: RegisterStudentUseCase

describe('Register Student', () => {
    beforeEach(() => {
        inMemoryStudentsRepository =
            new InMemoryStudentsRepository()
        fakeHasher = new FakeHasher

        sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
    })

    it('should to be able to register a new student', async () => {
        const result = await sut.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "securePassword123"
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toEqual({
            student: inMemoryStudentsRepository.items[0],
        })
    })

    it('should hash student password upon registration', async () => {
        const result = await sut.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "securePassword123"
        })

        const hashedPassword = await fakeHasher.hash('securePassword123')

        expect(result.isRight()).toBeTruthy()
        expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
    })
})
