import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env.service";
import { CacheRepository } from "./cache-repository";
import { RedisCacheRespository } from "./redis/redis-cache-repository";
import { RedisSerivice } from "./redis/redis.service";

@Module({
    imports: [EnvModule],
    providers: [
        RedisSerivice,
        {
            provide: CacheRepository,
            useClass: RedisCacheRespository,
        }
    ],
    exports: [CacheRepository]
})
export class CacheModule { }
