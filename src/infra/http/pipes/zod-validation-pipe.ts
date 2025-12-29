import { PipeTransform, BadRequestException } from '@nestjs/common'
import z, { ZodError, ZodType } from 'zod'

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) { }

    transform(value: unknown) {
        try {
            this.schema.parse(value)
        } catch (error) {
            if (error instanceof ZodError) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    statusCode: 400,
                    errors: z.treeifyError(error)
                })
            }
            throw new BadRequestException('Validation failed')
        }

        return value
    }
}
