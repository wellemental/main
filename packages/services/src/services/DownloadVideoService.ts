import { DownloadVideoServiceType } from '../types';
import RNFS, { DownloadResult } from 'react-native-fs';

export type DownloadProgressCallbackResult = RNFS.DownloadProgressCallbackResult;

class DownloadVideoService implements DownloadVideoServiceType {
  private convertUrlToFileName = (videoUrl: string): string => {
    return videoUrl.substring(videoUrl.lastIndexOf('/') + 1, videoUrl.length);
  };

  // Need to launch separate firebase instance for this
  // https://rnfirebase.io/app/usage
  // private getVideoSize = async (url: string) => {
  //   const store = storage();
  //   const storageRef = store.getReferce();
  //   const assetRef = storageRef.child(url);

  //   try {
  //     const metadata = await assetRef.getMetadata();
  //     return metadata.size;
  //   } catch (err) {
  //     return Promise.reject('Unable to get video size');
  //   }
  // };

  private createPathname = (filename: string): string => {
    return RNFS.DocumentDirectoryPath + '/' + filename;
  };

  public checkExists = async (videoUrl: string): Promise<boolean> => {
    const filename = this.convertUrlToFileName(videoUrl);
    const path_name = this.createPathname(filename);
    try {
      const res = await RNFS.exists(path_name);
      return res;
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
      return Promise.resolve();
    }
    RNFS.downloadFile({
      fromUrl: videoUrl,
      toFile: path_name.replace(/%20/g, '_'),
      discretionary: true,
      cacheable: true,
    })
      .promise.then(res => {
        // console.log('Response', res);
        // return RNFS.readFile(path_name.replace(/%20/g, '_'), 'base64');
      })
      .catch(err => {
        // console.log('Error downloading video', err);
        return Promise.reject(`Error downloading video - ${err}`);
      });
  }

  public async getVideo(videoUrl: string): Promise<string> {
    const filename = this.convertUrlToFileName(videoUrl);
    let path_name = videoUrl;

    try {
      const result = await RNFS.readDir(RNFS.DocumentDirectoryPath);
      result.forEach(element => {
        if (element.name === filename) {
          path_name = element.path;
        }
      });
    } catch (err) {
      return Promise.reject('Error getting video');
    }
    return Promise.resolve(path_name);
  }

  public async deleteVideo(videoUrl: string): Promise<void> {
    const filename = this.convertUrlToFileName(videoUrl);
    const path_name = this.createPathname(filename);

    try {
      await RNFS.unlink(path_name);
      console.log('deleting', res);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err.message);
    }
  }
}

export default DownloadVideoService;
