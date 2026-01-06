import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { Student } from '../../enterprise/entities/student'
import { HashGenerator } from '../cryptography/hash-generator'
import { hash } from 'crypto'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { JwtService } from '@nestjs/jwt'

interface AuthenticateStudentUseCaseRequest {
    email: string
    password: string
}

type AuthenticateStudentUseCaseResponse = Either<
    WrongCredentialsError,
    {
        accessToken: string
    }
>

@Injectable()
export class AuthenticateStudentUseCase {
    constructor(
        private studentsRepository: StudentsRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter,
    ) { }

    async execute({
        email,
        password
    }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
        const student = await this.studentsRepository.findByEmail(email)

        if (!student) {
            return left(new WrongCredentialsError())
        }

        const isPasswordValid = await this.hashComparer.compare(password, student.password)

        if (!isPasswordValid) {
            return left(new WrongCredentialsError())
        }

        const accessToken = await this.encrypter.encrypt({
            sub: student.id.toString()
        })

        return right({ accessToken })
    }
}
