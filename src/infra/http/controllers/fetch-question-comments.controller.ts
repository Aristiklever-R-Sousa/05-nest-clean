import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { AnswerPresenter } from "../presenters/answer-presenter";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { CommentPresenter } from "../presenters/comment.presenter";

const queryParamSchema = z.object({
    page: z.coerce
        .number()
        .min(1)
        .default(1)
})

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type PageQueryParamSchema = z.infer<typeof queryParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
    constructor(private fetchRecentQuestion: FetchQuestionCommentsUseCase) { }

    @Get()
    async handle(
        @Query(queryValidationPipe) query: PageQueryParamSchema,
        @Param('questionId') questionId: string,
    ) {
        const { page } = query

        const result = await this.fetchRecentQuestion.execute({
            questionId,
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const questionComments = result.value.questionComments

        return { comments: questionComments.map(CommentPresenter.toHTTP) }
    }
}
