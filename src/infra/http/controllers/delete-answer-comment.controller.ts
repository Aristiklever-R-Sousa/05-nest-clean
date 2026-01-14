import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param, UseGuards } from "@nestjs/common";

@Controller('/answers/comments/:id')
@UseGuards(JwtAuthGuard)
export class DeleteAnswerCommentController {
    constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerCommentId: string,
    ) {
        const userId = user.sub

        const result = await this.deleteAnswerComment.execute({
            answerCommentId,
            authorId: userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
