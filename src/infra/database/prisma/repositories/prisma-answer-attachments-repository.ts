import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
    constructor(private prisma: PrismaService) { }

    async createMany(attachments: AnswerAttachment[]): Promise<void> {
        if (attachments.length === 0) return

        await this.prisma.attachment.updateMany({
            where: {
                id: { in: attachments.map(item => item.attachmentId.toString()) }
            },
            data: {
                answerId: attachments[0].answerId.toString()
            }
        })
    }

    async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
        if (attachments.length === 0) return

        await this.prisma.attachment.deleteMany({
            where: {
                id: { in: attachments.map(item => item.attachmentId.toString()) }
            }
        })
    }

    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        const answerAttachments = await this.prisma.attachment.findMany({
            where: { answerId },
        })

        return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain)
    }

    async deleteManyByAnswerId(answerId: string): Promise<void> {
        await this.prisma.attachment.deleteMany({
            where: { answerId },
        })
    }

}
