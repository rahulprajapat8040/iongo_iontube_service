import { Queue } from "bullmq";
import { RedisConfig } from "../modules/redis/redis.config";

export const TranscodeQueue = new Queue('transcode-queue', {
    connection: RedisConfig
})