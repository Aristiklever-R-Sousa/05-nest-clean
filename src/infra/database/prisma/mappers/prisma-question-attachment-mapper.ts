import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Attachment as PrismaAttachment, Prisma } from "prisma/generated/client";

export class PrismaQuestionAttachmentMapper {
    static toDomain(raw: PrismaAttachment) {
        if (!raw.questionId) throw new Error('Invalid attachment type.')

        return QuestionAttachment.create({
            attachmentId: new UniqueEntityId(raw.id),
            questionId: new UniqueEntityId(raw.questionId),
        }, new UniqueEntityId(raw.id));
    }

}
