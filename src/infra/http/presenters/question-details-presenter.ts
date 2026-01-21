import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
    static toHTTP(questionDetails: QuestionDetails) {
        return {
            questionId: questionDetails.questionId.toString(),
            slug: questionDetails.slug.value,
            title: questionDetails.title,
            content: questionDetails.content,
            bestAnswerId: questionDetails.bestAnswerId?.toString() || null,
            authorId: questionDetails.authorId.toString(),
            authorName: questionDetails.authorName,
            attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
            createdAt: questionDetails.createdAt,
            updatedAt: questionDetails.updatedAt
        }
    }
}
