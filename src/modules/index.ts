import { S3Module } from "./aws/s3.module";
import { DatabaseModule } from "./database/database.module";
import { FileModule } from "./file/file.module";
import { IonTubeModule } from "./iontube/iontube.module";
import { TranscodeModule } from "./transcoder/transcode.module";

const Modules = [DatabaseModule, FileModule, IonTubeModule, S3Module, TranscodeModule];

export default Modules;