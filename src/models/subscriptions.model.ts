import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import ModelName from "src/utils/common/modelName";
import { Channel } from "./channel.model";

@Table({ tableName: ModelName.subscriptions, paranoid: true })
export class Subscriptions extends Model<Subscriptions, Partial<Subscriptions>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @ForeignKey(() => Channel)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare subscribedById: string;

    @BelongsTo(() => Channel, { foreignKey: "subscribedById" })
    declare subscribedBy: Channel;

    @ForeignKey(() => Channel)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare subscribedToId: string;

    @BelongsTo(() => Channel, { foreignKey: "subscribedToId" })
    declare subscribedTo: Channel;
}
