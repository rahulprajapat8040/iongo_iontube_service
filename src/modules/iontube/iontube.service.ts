import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Channel, Tag, VideoFormates, Videos, VideoTag } from "src/models";
import { MulterRequest } from "src/types/multer.type";
import { generateFileName, generatePagination, getPages, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { FileService } from "../file/file.service";
import STRINGCONST from "src/utils/common/stringConst";
import { S3Service } from "../aws/s3.service";
import { TranscodeService } from "../transcoder/transcode.service";
import { TranscodeQueue } from "src/queue/transcode.queue";

@Injectable()
export class IonTubeService {
    constructor(
        private readonly fileService: FileService,
        private readonly s3Service: S3Service,
        private readonly transcodeService: TranscodeService,
        @InjectModel(Videos) private readonly videoModel: typeof Videos,
        @InjectModel(VideoFormates) private readonly videoFormateModel: typeof VideoFormates,
        @InjectModel(Tag) private readonly tagModel: typeof Tag,
        @InjectModel(VideoTag) private readonly videoTagModel: typeof VideoTag,
        @InjectModel(Channel) private readonly channelModel: typeof Channel,
    ) { }

    async createChannel(req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'channel')
        try {
            const imageFile = file.find((f) => f.fieldname === 'image');
            const bannerImageFile = file.find((f) => f.fieldname === 'bannerImage');
            const channel = await this.channelModel.create({
                ...body,
                image: imageFile?.path || body.image,
                bannerImage: bannerImageFile?.path || body.videoUrl,
            })
            return responseSender(STRINGCONST.DATA_ADDED, HttpStatus.CREATED, true, channel)
        } catch (error) {
            SendError(error.message)
        }
    };

    async getAllChannels(queryParams) {
        try {
            const { page, limit, offset } = getPages(queryParams.page, queryParams.limit)
            const res = await this.channelModel.findAndCountAll({
                where: { ownerId: queryParams.ownerId },
                limit, offset
            })
            const response = generatePagination(res, page, limit)
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, response)
        } catch (error) {
            console.log(error.message)
            SendError(error.message)
        }
    }

    async uploadVideo(file: Express.Multer.File, req: MulterRequest) {
        console.log('file is', file)
        try {
            const video = await this.videoModel.create({
                ...req.body,
            });
            const s3Upload = await this.s3Service.uploadFile(file, video.id, 'video.mp4');
            // const s3Upload = await this.s3Service.uploadFile(req.files[0], video.id, 'video.mp4')
            await video.update(
                { videoUrl: s3Upload.url }
            );

            // for (const tagName of JSON.parse(tagNames)) {
            //     const [tag] = await this.tagModel.findOrCreate({
            //         where: { name: tagName },
            //         defaults: { name: tagName } as Partial<Tag>,
            //     });
            //     tagInstances.push(tag);
            // }
            // const tagIds = tagInstances.map(tag => tag.id);
            // const uniqueTagIds = [...new Set(tagIds)]
            // await video.$set('tags', uniqueTagIds);
            return responseSender(STRINGCONST.VIDEO_UPLOADED, HttpStatus.CREATED, true, video);
        } catch (error) {
            this.fileService.removeFile(file)
            console.log(error)
            SendError(error.message);
        }
    };

    async updateVideoDetail(videoId: string, req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'thumbnails')
        try {
            const video = await this.videoModel.findByPk(videoId)
            if (!video) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            const tagNames: string[] = JSON.parse(body.tags || '[]');
            const tagInstances: Tag[] = [];
            for (const tagName of tagNames) {
                const [tag] = await this.tagModel.findOrCreate({
                    where: { name: tagName },
                    defaults: { name: tagName } as Partial<Tag>,
                });
                tagInstances.push(tag);
            }
            const tagIds = tagInstances.map(tag => tag.id);
            const uniqueTagIds = [...new Set(tagIds)]
            const videoUrl = await this.s3Service.generateVideoUrl(`uploads/raw`, videoId, 'video.mp4');
            await TranscodeQueue.add('transcode', {
                filePath: videoUrl,
                videoId: video.id,
            });
            await video.$set('tags', uniqueTagIds);
            await video.update({ ...body, thumbnailUrl: file[0] ? file[0].path : body.thumbnailUrl })
            return responseSender(STRINGCONST.DATA_ADDED, HttpStatus.OK, true, video)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getAllVideos(queryParams) {
        try {
            const { page, limit, offset } = getPages(queryParams.page, queryParams.limit)
            const videos = await this.videoModel.findAndCountAll({
                limit, offset,
                include: [{ model: this.channelModel }],
                distinct: true
            });
            const response = generatePagination(videos, page, limit);
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getVideoById(videoId: string, quality?: string) {
        try {
            const filename = quality ? generateFileName(videoId, quality) : 'video.mp4'
            const video = await this.videoModel.findByPk(videoId, {
                include: [
                    { model: this.tagModel },
                    { model: this.videoFormateModel }
                ]
            })
            if (!video) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            };
            const videoUrl = await this.s3Service.generateVideoUrl(`uploads/raw`, videoId, filename);
            (video as any).dataValues.videoOriginal = videoUrl
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, video)
        } catch (error) {
            console.log('e', error)
            SendError(error.message)
        }
    }
}