import { IsNotEmpty, IsUUID } from "class-validator";

export class VideoReactionDto {
    @IsNotEmpty({ message: "reaction is reuired" })
    reaction: 'like' | 'disLike'
    @IsNotEmpty({ message: 'channelId is required' })
    @IsUUID()
    channelId: string
    @IsNotEmpty({ message: "video id is required" })
    @IsUUID()
    videoId: string
}