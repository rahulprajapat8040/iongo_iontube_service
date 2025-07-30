import { Controller, Get, Post, Query, Req } from "@nestjs/common";
import { IonTubeService } from "./iontube.service";
import { MulterRequest } from "src/types/multer.type";

@Controller("iontube")
export class IonTubeController {
    constructor(
        private readonly iontubeService: IonTubeService,
    ) { }

    @Post('create-channel')
    async createChannel(
        @Req() req: MulterRequest
    ) {
        return this.iontubeService.createChannel(req)
    }

    @Post("upload-video")
    async uploadVideo(
        @Req() req: MulterRequest
    ) {
        return this.iontubeService.uploadVideo(req)
    }

    @Get('get-all-videos')
    async getAllVideos(
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.iontubeService.getAllVideos({ page, limit })
    }

    @Get("get-video-by-id")
    async getVideoById(
        @Query('videoId') videoId: string
    ) {
        return this.iontubeService.getVideoById(videoId)
    }
}