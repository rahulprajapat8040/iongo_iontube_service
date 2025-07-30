import { DatabaseModule } from "./database/database.module";
import { FileModule } from "./file/file.module";
import { IonTubeModule } from "./iontube/iontube.module";

const Modules = [DatabaseModule, FileModule, IonTubeModule];

export default Modules;