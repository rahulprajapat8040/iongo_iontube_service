import { Injectable, OnModuleInit } from "@nestjs/common";
import { Worker } from "bullmq";
import { RedisConfig } from "src/modules/redis/redis.config";
import { TranscodeService } from "src/modules/transcoder/transcode.service";

@Injectable()
export class TranscodeQueueWorker implements OnModuleInit {
    constructor(private readonly transcodeService: TranscodeService) { }

    onModuleInit() {
        new Worker(
            'transcode-queue',
            async job => {
                const { filePath, videoId } = job.data
                console.log('file path and videoId is', filePath, videoId)
                await this.transcodeService.generateResolutions(filePath, videoId)
            }, {
            connection: RedisConfig
        }
        )
    }
}