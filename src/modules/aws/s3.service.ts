import { DeleteObjectCommand, GetObjectCommand, PutObjectAclCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import * as fs from 'fs';
import * as mime from 'mime-types';

@Injectable()
export class S3Service {
    private s3: S3Client
    private bucket: string | undefined

    constructor(private configService: ConfigService) {
        this.s3 = new S3Client({
            region: this.configService.get<string>('AWS_REGION')!,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
            },
        });
        this.bucket = this.configService.get<string>('S3_BUCKET_NAME');
    }

    async uploadFileBuffer(buffer: Buffer, key: string, contentType: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        });

        await this.s3.send(command);
        return { url: `https://${this.bucket}.s3.amazonaws.com/${key}` };
    }

    async uploadFile(file: Express.Multer.File, videoId: string, filename: string) {
        const key = `uploads/raw/${videoId}/${filename}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype || 'video/mp4'
        });

        await this.s3.send(command);

        return {
            url: `https://${this.bucket}.s3.${this.configService.get(
                'AWS_REGION',
            )}.amazonaws.com/${key}`,
            key, // you’ll need this if you want to reference the object later
        };
    }

    async uploadFileFromPath(filePath: string, videoId: string, filename: string) {
        const key = `uploads/resolutions/${videoId}/${filename}`;
        const fileStream = fs.createReadStream(filePath);
        const mimeType = mime.lookup(filePath) || 'video/mp4';

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: fileStream,
            ContentType: mimeType,
        });

        try {
            await this.s3.send(command);
            return {
                url: `https://${this.bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`,
                key,
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(key: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return this.s3.send(command);
    }

    async getFileStream(key: string): Promise<Readable> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        const { Body } = await this.s3.send(command);
        return Body as Readable;
    }


    async generateVideoUrl(keyName: string, videoId: string, filename: string): Promise<string> {
        const key = `${keyName}/${videoId}/${filename}`;

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        const url = await getSignedUrl(this.s3, command, {
            expiresIn: 3600, // 1 hour
        });

        return url;
    }
}