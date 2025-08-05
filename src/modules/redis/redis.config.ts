import { RedisOptions } from "bullmq";

export const RedisConfig: RedisOptions = {
    host: `${process.env.REDIS_HOST}`,
    port: Number(process.env.REDIS_PORT)
}