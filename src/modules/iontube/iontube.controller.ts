import { Controller, Get, Post, Put, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { IonTubeService } from "./iontube.service";
import { MulterRequest } from "src/types/multer.type";
import { FileInterceptor } from "@nestjs/platform-express";

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

    @Get('get-user-channels')
    async getChannel(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('ownerId') ownerId: string,

    ) {
        return this.iontubeService.getAllChannels({ page, limit, ownerId })
    }

    @Post("upload-video")
    @UseInterceptors(
        FileInterceptor('video')
    )
    async uploadVideo(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: MulterRequest
    ) {
        return this.iontubeService.uploadVideo(file, req)
    }

    @Put('update-video-detail')
    async updateVideoDetail(
        @Query('videoId') videoId: string,
        @Req() req: MulterRequest
    ) {
        return this.iontubeService.updateVideoDetail(videoId, req)
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