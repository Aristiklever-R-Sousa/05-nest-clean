import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { AnswerPresenter } from "../presenters/answer-presenter";

const queryParamSchema = z.object({
    page: z.coerce
        .number()
        .min(1)
        .default(1)
})

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type PageQueryParamSchema = z.infer<typeof queryParamSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
    constructor(private fetchRecentQuestion: FetchQuestionAnswersUseCase) { }

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

        const answers = result.value.answers

        return { answers: answers.map(AnswerPresenter.toHTTP) }
    }
}
