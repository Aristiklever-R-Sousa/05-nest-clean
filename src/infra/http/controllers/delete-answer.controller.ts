import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Put, UseGuards } from "@nestjs/common";

@Controller('/answers/:id')
@UseGuards(JwtAuthGuard)
export class DeleteAnswerController {
    constructor(private deleteAnswer: DeleteAnswerUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string,
    ) {
        const userId = user.sub

        const result = await this.deleteAnswer.execute({
            authorId: userId,
            answerId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
