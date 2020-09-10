import React from 'react';
import {
  DownloadVideoServiceType,
  DownloadProgressCallbackResult,
} from '../types';
import { ApplicationError } from '../models/Errors';
import logger from '../services/LoggerService';
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
    setProgress: (res: DownloadProgressCallbackResult) => void,
  ): Promise<void | { jobId: number; promise: Promise<DownloadResult> }> {
    const filename = this.convertUrlToFileName(videoUrl);
    const path_name = this.createPathname(filename);

    const exists = await this.checkExists(videoUrl);

    if (exists) {
      console.log('ALREADY DOWNLOADED');
      logger.info('Already downloaded');
      return Promise.resolve();
    } else {
    }

    console.log(' DOWNLOADING!!!');
    await RNFS.downloadFile({
      fromUrl: videoUrl,
      toFile: path_name.replace(/%20/g, '_'),
      background: true,
      progress: setProgress,
      progressDivider: 1,
    })
      .promise.then((res) => {
        console.log('File Downloaded', res);
      })
      .catch((err) => {
        console.log('err downloadFile', err);
      });

    // } catch (err) {
    //   logger.error(`Err downloadFile - ${err}`);
    //   console.log('ERROR DOWNLOADING', err);
    //   return Promise.reject(err);
    // }
  }

  public async getVideo(videoUrl: string): Promise<string> {
    const filename = this.convertUrlToFileName(videoUrl);

    try {
      const result = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      console.log('RESULT', result);
      result.forEach((element) => {
        if (element.name === filename.replace(/%20/g, '_')) {
          console.log('MATCH THOOOO', element.path, filename);
          return Promise.resolve(element.path);
        }
      });
    } catch (err) {
      logger.error(`Error getting video - ${err}`);
    }
    return Promise.resolve(videoUrl);
  }

  public async deleteVideo(videoUrl: string): Promise<void> {
    const filename = this.convertUrlToFileName(videoUrl);
    const path_name = this.createPathname(filename);

    try {
      const res = await RNFS.unlink(path_name);
      console.log('FILE DELETED', res);
      return Promise.resolve();
    } catch (err) {
      logger.error('Error deleting video cache');
      return Promise.reject(err.message);
    }
  }
}

export default DownloadVideoService;
