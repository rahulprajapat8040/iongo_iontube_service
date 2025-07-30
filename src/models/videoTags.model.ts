// videoTag.entity.ts
import {
    Table,
    Column,
    Model,
    ForeignKey,
    DataType,
} from 'sequelize-typescript';
import ModelName from 'src/utils/common/modelName';
import { Tag } from './tags.model';
import { Videos } from './videos.model';

@Table({ tableName: ModelName.videoTags, paranoid: true })
export class VideoTag extends Model<VideoTag> {
    @ForeignKey(() => Videos)
    @Column({ type: DataType.UUID })
    declare videoId: string;

    @ForeignKey(() => Tag)
    @Column({ type: DataType.UUID })
    declare tagId: string;
}
