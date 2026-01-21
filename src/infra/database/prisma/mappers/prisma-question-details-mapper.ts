import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion, User as PrismaUser, Attachment as PrismaAttachment } from "prisma/generated/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaUser
    attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
    static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
        return QuestionDetails.create({
            questionId: new UniqueEntityId(raw.id),
            slug: Slug.create(raw.slug),
            title: raw.title,
            content: raw.content,
            bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
            authorId: new UniqueEntityId(raw.author.id),
            authorName: raw.author.name,
            attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}
