import { Body, Controller, Delete, Get, Post, Put, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { IonTubeService } from "./iontube.service";
import { MulterRequest } from "src/types/multer.type";
import { FileInterceptor } from "@nestjs/platform-express";
import { VideoReactionDto } from "src/utils/dto/iontube.dto";

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
        @Query('videoId') videoId: string,
    ) {
        return this.iontubeService.getVideoById(videoId)
    }

    @Get('get-video-url')
    async getVideoUrl(
        @Query('videoId') videoId: string,
        @Query('quality') quality: string
    ) {
        return this.iontubeService.getVideoUrl(videoId, quality)
    }

    @Get('is-already-reacted')
    async getIsAlreadyReacted(
        @Query('channelId') channelId: string,
        @Query('videoId') videoId: string

    ) {
        return this.iontubeService.getIsAlreadyReacted(channelId, videoId)
    }

    @Post('react-to-video')
    async reactToVideo(
        @Body() videoReactionDto: VideoReactionDto
    ) {
        return this.iontubeService.reactToVideo(videoReactionDto)
    }

    @Delete('remove-reaction')
    async removeReaction(
        @Query('channelId') channelId: string,
        @Query('videoId') videoId: string
    ) {
        return this.iontubeService.removeReaction(channelId, videoId)
    }
}