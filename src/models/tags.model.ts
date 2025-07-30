// tag.entity.ts
import {
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
    BelongsToMany,
} from 'sequelize-typescript';
import { Videos } from './videos.model';
import ModelName from 'src/utils/common/modelName';
import { VideoTag } from './videoTags.model';

@Table({ tableName: ModelName.tags, paranoid: true })
export class Tag extends Model<Tag, Partial<Tag>> {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare name: string;

    @BelongsToMany(() => Videos, () => VideoTag)
    declare videos: Videos[];
}
