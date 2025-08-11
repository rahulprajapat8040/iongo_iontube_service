import { Channel } from "./channel.model";
import { Subscriptions } from "./subscriptions.model";
import { Tag } from "./tags.model";
import { VideoFormates } from "./videoFormates.model";
import { VideoReaction } from "./videoReaction.model";
import { Videos } from "./videos.model";
import { VideoTag } from "./videoTags.model";

const Models = [Videos, VideoFormates, Tag, VideoTag, Channel, Subscriptions, VideoReaction];

export { Videos, VideoFormates, Tag, VideoTag, Channel, Subscriptions, VideoReaction }

export default Models