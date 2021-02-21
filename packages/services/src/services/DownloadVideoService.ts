import { DownloadVideoServiceType } from '../types';
// import logger from '../services/LoggerService';
// import tracker, { TrackingEvents } from './TrackerService';
import RNFS, { DownloadResult } from 'react-native-fs';

class DownloadVideoService implements DownloadVideoServiceType {
  private convertUrlToFileName = (videoUrl: string): string => {
    return videoUrl.substring(videoUrl.lastIndexOf('/') + 1, videoUrl.length);
  };

  private createPathname = (filename: string): string => {
    return RNFS.DocumentDirectoryPath + '/' + filename;
  };

  public checkExists = async (videoUrl: string): Promise<boolean> => {
    const filename = this.convertUrlToFileName(videoUrl);
    const path_name = this.createPathname(filename);
    try {
      return await RNFS.exists(path_name);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  public async downloadVideo(
    videoUrl: string,
  ): Promise<void | { jobId: number; promise: Promise<DownloadResult> }> {
    const filename = this.convertUrlToFileName(videoUrl);
    const path_name = this.createPathname(filename);

    const exists = await this.checkExists(videoUrl);

    if (exists) {
      // logger.info('Already downloaded');
      return Promise.resolve();
    }

    await RNFS.downloadFile({
      fromUrl: videoUrl,
      toFile: path_name.replace(/%20/g, '_'),
      background: true,
    })
      .promise.then((res) => {
        // tracker.track(TrackingEvents.DownloadVideo);
        // logger.info(`File Downloaded: ${res}`);
      })
      .catch((err) => {
        // logger.error(`Err downloadFile: ${err}`);
      });
  }

  public async getVideo(videoUrl: string): Promise<string> {
    const filename = this.convertUrlToFileName(videoUrl);
    let path_name = videoUrl;

    try {
      const result = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      result.forEach((element) => {
        if (element.name === filename) {
          path_name = element.path;
        }
      });
    } catch (err) {
      // logger.error(`Error getting video - ${err}`);
    }
    return Promise.resolve(path_name);
  }

  public async deleteVideo(videoUrl: string): Promise<void> {
    const filename = this.convertUrlToFileName(videoUrl);
    const path_name = this.createPathname(filename);

    try {
      const res = await RNFS.unlink(path_name);
      // tracker.track(TrackingEvents.UndownloadVideo);
      // logger.info(`File Deleted - ${res}`);
      return Promise.resolve();
    } catch (err) {
      // logger.error('Error deleting video cache');
      return Promise.reject(err.message);
    }
  }
}

export default DownloadVideoService;
