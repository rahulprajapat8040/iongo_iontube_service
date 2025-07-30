import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Channel, Tag, Videos, VideoTag } from "src/models";
import { MulterRequest } from "src/types/multer.type";
import { generatePagination, getPages, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { FileService } from "../file/file.service";
import STRINGCONST from "src/utils/common/stringConst";

@Injectable()
export class IonTubeService {
    constructor(
        private readonly fileService: FileService,
        @InjectModel(Videos) private readonly videoModel: typeof Videos,
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

    async uploadVideo(req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'iontube');

        try {
            const video = await this.videoModel.create({
                videoUrl: file[0] ? file[0].path : body.videoUrl
            });

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

    async updateVideoDetail(videoId: string, videoDetailDto) {
        try {
            const video = await this.videoModel.findByPk(videoId)
            if (!video) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            await video.update({ ...videoDetailDto })
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
                include: [{ model: this.tagModel }],
                distinct: true
            });
            const response = generatePagination(videos, page, limit);
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getVideoById(videoId: string) {
        try {
            const video = await this.videoModel.findByPk(videoId, {
                include: [{ model: this.tagModel }]
            })
            if (!video) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            };
            return responseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, video)
        } catch (error) {
            SendError(error.message)
        }
    }
}