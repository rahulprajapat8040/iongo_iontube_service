import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/utils/common/modelName";
import { Tag } from "./tags.model";
import { VideoTag } from "./videoTags.model";
import { Channel } from "./channel.model";

@Table({ tableName: ModelName.videos, paranoid: true })
export class Videos extends Model<Videos, Partial<Videos>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare title: string
    @Column({
        type: DataType.TEXT("long")
    })
    declare description: string
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare uploadedById: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare videoUrl: string
    @Column({
        type: DataType.STRING,
    })
    declare thumbnailUrl: string;
    @Column({
        type: DataType.INTEGER,
    })
    declare duration: number;
    @Column({
        type: DataType.ENUM('draft', 'published', 'private', 'processing'),
        defaultValue: 'draft',
    })
    declare status: 'draft' | 'published' | 'private' | 'processing';
    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    declare views: number;

    @BelongsToMany(() => Tag, () => VideoTag)
    declare tags: Tag[];

    @ForeignKey(() => Channel)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    declare channelId: string
    @BelongsTo(() => Channel)
    declare channel: Channel

}