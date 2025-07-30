import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import Models from "src/models";

const { HOST, PORT, DBPORT, PASSWORD, DB_USERNAME, DATABASE, MAXIMUM_RETRY_COUNT, RETRY_TIMEOUT } = process.env
@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: HOST,
            port: Number(DBPORT),
            username: DB_USERNAME,
            password: String(PASSWORD),
            database: DATABASE,
            autoLoadModels: true,
            logging: false,
            sync: { alter: true },
            retry: {
                max: Number(MAXIMUM_RETRY_COUNT),
                timeout: Number(RETRY_TIMEOUT)
            },
            models: Models
        })
    ]
})
export class DatabaseModule { }