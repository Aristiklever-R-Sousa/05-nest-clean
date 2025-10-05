import { Controller, Post } from "@nestjs/common";

@Controller('/accounts')
export class CreateAccountController {

    @Post()
    async handle() {
        return 'Hello World!'
    }

}
