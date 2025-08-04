import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Injectable } from '@nestjs/common';
import { S3Service } from '../aws/s3.service';
import axios from 'axios';
import { InjectModel } from '@nestjs/sequelize';
import { VideoFormates } from 'src/models';

@Injectable()
export class TranscodeService {
    constructor(
        private readonly s3Service: S3Service,
        @InjectModel(VideoFormates) private readonly videoFormateModel: typeof VideoFormates,
    ) { }

    private readonly targetResolutions = [144, 240, 360, 480, 720, 1080];

    async generateResolutions(fileUrl: string, videoId: string): Promise<void> {
        console.log('get called');

        try {
            const tmpDir = os.tmpdir();
            const filename = path.basename(fileUrl.split('?')[0]);
            const localInputPath = path.join(tmpDir, filename);

            console.log(`⬇️ Downloading video from S3: ${fileUrl}`);
            const response = await axios.get(fileUrl, { responseType: 'stream' });

            const writer = fs.createWriteStream(localInputPath);
            response.data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`📥 Video downloaded to: ${localInputPath}`);

            const originalHeight = await this.getOriginalVideoHeight(localInputPath);
            const validResolutions = this.targetResolutions.filter(r => r <= originalHeight);

            for (const height of validResolutions) {
                const outputFilename = `${videoId}_${height}p.mp4`;
                const outputPath = path.join(tmpDir, outputFilename);

                console.log(`⚙️ Transcoding to ${height}p...`);
                await this.transcodeToResolution(localInputPath, outputPath, height);

                console.log(`⬆️ Uploading ${height}p to S3...`);
                const fileBuffer = fs.readFileSync(outputPath);
                const s3Key = `uploads/raw/${videoId}/${outputFilename}`;

                const { url } = await this.s3Service.uploadFileBuffer(fileBuffer, s3Key, outputFilename);
                await this.videoFormateModel.create({
                    url: url, videoId
                })
                fs.unlinkSync(outputPath);
                console.log(`🧹 Deleted temp output file ${outputPath}`);
            }

            fs.unlinkSync(localInputPath);
            console.log(`🧹 Deleted original input file ${localInputPath}`);
        } catch (err) {
            console.error('❌ generateResolutions failed:', err);
        }
    }

    private getOriginalVideoHeight(filePath: string): Promise<number> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) {
                    console.error('❌ FFprobe error:', err);
                    return reject(err);
                }

                const videoStream = metadata.streams.find(s => s.codec_type === 'video');
                const height = videoStream?.height;

                if (!height) {
                    return reject(new Error('Unable to determine video height.'));
                }

                resolve(height);
            });
        });
    }

    private transcodeToResolution(inputPath: string, outputPath: string, height: number): Promise<void> {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoCodec('libx264')
                .audioCodec('aac')
                .outputOptions([
                    '-preset', 'fast',
                    '-crf', '28',
                    '-vf', `scale=-2:${height}`,
                    '-max_muxing_queue_size', '9999',
                ])
                .on('start', commandLine => {
                    console.log(`🚀 FFmpeg started: ${commandLine}`);
                })
                .on('end', () => {
                    console.log(`✅ Transcoding finished for ${height}p`);
                    resolve();
                })
                .on('error', (err, stdout, stderr) => {
                    console.error(`💥 FFmpeg error for ${height}p:`, err.message);
                    console.error('STDOUT:', stdout);
                    console.error('STDERR:', stderr);
                    reject(err);
                })
                .save(outputPath);
        });
    }
}
