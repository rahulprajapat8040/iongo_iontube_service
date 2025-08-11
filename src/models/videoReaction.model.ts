import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/utils/common/modelName";
import { Channel } from "./channel.model";
import { Videos } from "./videos.model";

@Table({ tableName: ModelName.videoReaction })
export class VideoReaction extends Model<VideoReaction, Partial<VideoReaction>> {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.ENUM("like", "disLike"),
        defaultValue: 'like'
    })
    declare reaction: 'like' | 'disLike'

    @ForeignKey(() => Channel)
    @Column({
        type: DataType.UUID
    })
    declare channelId: string
    @BelongsTo(() => Channel)
    declare channel: Channel

    @ForeignKey(() => Videos)
    @Column({
        type: DataType.UUID
    })
    declare videoId: string
    @BelongsTo(() => Videos)
    declare video: Videos
}