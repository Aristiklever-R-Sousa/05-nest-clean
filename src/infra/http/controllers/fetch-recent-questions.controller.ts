import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

const queryParamSchema = z.object({
    page: z.coerce
        .number()
        .min(1)
        .default(1)
})

const queryValidationPipe = new ZodValidationPipe(queryParamSchema)

type PageQueryParamSchema = z.infer<typeof queryParamSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
    constructor(private fetchRecentQuestion: FetchRecentQuestionsUseCase) { }

    @Get()
    async handle(@Query(queryValidationPipe) query: PageQueryParamSchema) {
        const { page } = query

        const result = await this.fetchRecentQuestion.execute({
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const questions = result.value.questions

        return { questions: questions.map(QuestionPresenter.toHTTP) }
    }
}
