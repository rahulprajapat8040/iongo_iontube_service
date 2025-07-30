import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import Models from "src/models";
import { IonTubeController } from "./iontube.controller";
import { IonTubeService } from "./iontube.service";

@Module({
    imports: [SequelizeModule.forFeature(Models)],
    controllers: [IonTubeController],
    providers: [IonTubeService]
})
export class IonTubeModule { }