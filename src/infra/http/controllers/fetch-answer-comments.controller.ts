import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { CommentPresenter } from "../presenters/comment.presenter";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const queryParamSchema = z.object({
    page: z.coerce
        .number()
        .min(1)
        .default(1)
})

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type PageQueryParamSchema = z.infer<typeof queryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
    constructor(private fetchRecentQuestion: FetchAnswerCommentsUseCase) { }

    @Get()
    async handle(
        @Query(queryValidationPipe) query: PageQueryParamSchema,
        @Param('answerId') answerId: string,
    ) {
        const { page } = query

        const result = await this.fetchRecentQuestion.execute({
            answerId,
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const answerComments = result.value.comments

        return { comments: answerComments.map(CommentWithAuthorPresenter.toHTTP) }
    }
}
