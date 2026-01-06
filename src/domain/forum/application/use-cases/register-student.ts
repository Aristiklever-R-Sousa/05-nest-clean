import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { ConflictException, Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { Student } from '../../enterprise/entities/student'
import { HashGenerator } from '../cryptography/hash-generator'
import { hash } from 'crypto'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
    name: string
    email: string
    password: string
}

type RegisterStudentUseCaseResponse = Either<
    StudentAlreadyExistsError,
    {
        student: Student
    }
>

@Injectable()
export class RegisterStudentUseCase {
    constructor(
        private studentsRepository: StudentsRepository,
        private hashGenerator: HashGenerator,
    ) { }

    async execute({
        name,
        email,
        password
    }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
        const studentWithSameEmail = await this.studentsRepository.findByEmail(email)

        if (studentWithSameEmail) {
            return left(new StudentAlreadyExistsError(studentWithSameEmail.email))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const student = Student.create({
            name,
            email,
            password: hashedPassword
        })
        await this.studentsRepository.create(student)

        return right({ student })
    }
}
