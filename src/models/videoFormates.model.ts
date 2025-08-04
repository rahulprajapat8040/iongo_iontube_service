import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/utils/common/modelName";
import { Videos } from "./videos.model";

@Table({ tableName: ModelName.videoFormates, paranoid: true })
export class VideoFormates extends Model<VideoFormates, Partial<VideoFormates>> {
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
    url: string

    @ForeignKey(() => Videos)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare videoId: string

    @BelongsTo(() => Videos)
    declare video: Videos

}