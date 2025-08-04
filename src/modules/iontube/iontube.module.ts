import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import Models from "src/models";
import { IonTubeController } from "./iontube.controller";
import { IonTubeService } from "./iontube.service";
import { TranscodeService } from "../transcoder/transcode.service";

@Module({
    imports: [SequelizeModule.forFeature(Models)],
    controllers: [IonTubeController],
    providers: [IonTubeService, TranscodeService]
})
export class IonTubeModule { }