import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';

/**
 * Represents a message sent between processes for video processing tasks.
 */
export default class VideoProcessingMessageDto {
    /**
     * The type of video processing task to be performed.
     */
    @IsIn(['joinAudioToImage', 'mergeVideos'])
    action: 'joinAudioToImage' | 'mergeVideos';

    /**
     * The URL of the image file to be used in the video processing task.
     * This property is optional and required only for 'joinAudioToImage' action.
     */
    @IsOptional()
    @IsString()
    image?: string;

    /**
     * The URL of the audio file to be used in the video processing task.
     * This property is optional and required only for 'joinAudioToImage' action.
     */
    @IsOptional()
    @IsString()
    audio?: string;

    /**
     * The desired filename for the output video.
     * This property is optional and required only for 'joinAudioToImage' and 'mergeVideos' actions.
     */
    @IsOptional()
    @IsString()
    filename?: string;

    /**
     * An array of URLs of the video files to be merged.
     * This property is optional and required only for 'mergeVideos' action.
     */
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    videoURLs?: string[];
}