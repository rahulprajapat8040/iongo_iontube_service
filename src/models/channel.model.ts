import { Column, DataType, HasMany, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import ModelName from "src/utils/common/modelName";
import { Videos } from "./videos.model";

@Table({ tableName: ModelName.channel, paranoid: true })
export class Channel extends Model<Channel, Partial<Channel>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare channelName: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare channelTitle: string
    @Column({
        type: DataType.TEXT("long")
    })
    declare description: string
    @Column({
        type: DataType.STRING
    })
    declare image: string
    @Column({
        type: DataType.STRING
    })
    declare bannerImage: string
    @Column({
        type: DataType.UUID
    })
    declare ownerId: string

    @HasMany(() => Videos)
    declare videos: Videos[]
}