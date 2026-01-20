import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

const editAnswerBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.uuid())
})

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
@UseGuards(JwtAuthGuard)
export class EditAnswerController {
    constructor(private editAnswer: EditAnswerUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string,
    ) {
        const { content, attachments } = body

        const userId = user.sub

        const result = await this.editAnswer.execute({
            content,
            authorId: userId,
            answerId,
            attachmentsIds: attachments,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
