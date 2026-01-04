import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion } from "prisma/generated/client";

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion) {
        return Question.create({
            authorId: new UniqueEntityId(raw.authorId),
            bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
            content: raw.content,
            slug: Slug.create(raw.slug),
            title: raw.title,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityId(raw.id));
    }
}
