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

export class SubscribeChannelDto {
    @IsNotEmpty({ message: "isAlreadySubscribe is reuired" })
    isAlreadySubscribe: boolean
    @IsNotEmpty({ message: 'subscribed by channel id is required' })
    @IsUUID()
    subscribedToId: string
    @IsNotEmpty({ message: "subscribed channel id is required" })
    @IsUUID()
    subscribedById: string
}