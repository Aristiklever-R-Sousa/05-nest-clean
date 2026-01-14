import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Put, UseGuards } from "@nestjs/common";

@Controller('/questions/:id')
@UseGuards(JwtAuthGuard)
export class DeleteQuestionController {
    constructor(private deleteQuestion: DeleteQuestionUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string,
    ) {
        const userId = user.sub

        const result = await this.deleteQuestion.execute({
            authorId: userId,
            questionId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
