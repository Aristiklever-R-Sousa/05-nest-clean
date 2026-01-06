import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { User as PrismaStudent, Prisma } from "prisma/generated/client";

export class PrismaStudentMapper {
    static toDomain(raw: PrismaStudent) {
        return Student.create({
            name: raw.name,
            email: raw.email,
            password: raw.password,
        }, new UniqueEntityId(raw.id));
    }

    static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
        return {
            id: student.id.toString(),
            name: student.name,
            email: student.email,
            password: student.password,
        }
    }
}
