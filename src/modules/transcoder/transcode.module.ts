import { Module } from "@nestjs/common";
import { TranscodeService } from "./transcode.service";
import { TranscodeQueueWorker } from "src/queue/transcode.processor";
import { SequelizeModule } from "@nestjs/sequelize";
import { VideoFormates } from "src/models";

@Module({
    imports: [SequelizeModule.forFeature([VideoFormates])], 
    providers: [TranscodeService, TranscodeQueueWorker],
    exports: [TranscodeService]
})
export class TranscodeModule { }