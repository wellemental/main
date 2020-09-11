import React, { useState, useEffect } from 'react';
import { Button, Icon, Text } from 'native-base';
import { DownloadVideoService, Content } from 'services';
// import { useMutation } from '../hooks/useMutation';
import variables from '../assets/native-base-theme/variables/wellemental';
import { logger } from 'services';

interface Props {
  videoUrl: string;
}

const Download: React.FC<Props> = ({ videoUrl }) => {
  const [isDownloaded, toggleDownload] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const service = new DownloadVideoService();

  useEffect(() => {
    const checkIfDownloaded = async (): Promise<void> => {
      try {
        toggleDownload(await service.checkExists(videoUrl));
      } catch (err) {
        logger.error('Error checking video cache status');
        setError('Error, Try again');
      }
    };
    checkIfDownloaded();
  }, [videoUrl]);

  // Progress Indicator
  // const [progress, setProgress] = useState<number>(0);
  // const calcProgress = (data: DownloadProgressCallbackResult): void => {
  //   console.log('CALC PROGRESS');
  //   const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
  //   if (data) {
  //     setProgress(percentage);
  //   }
  // };

  const handleDownload = async () => {
    setLoading(true);
    try {
      if (isDownloaded) {
        await service.deleteVideo(videoUrl);
        toggleDownload(false);
      } else {
        await service.downloadVideo(videoUrl);
        toggleDownload(true);
      }
    } catch (err) {
      setError('Error. Try again.');
    }
    setLoading(false);
  };
  return (
    <>
      <Button
        iconRight
        disabled={loading}
        style={{
          paddingRight: 5,
          paddingLeft: 15,
          paddingBottom: 0,
          marginTop: -14,
        }}
        transparent
        onPress={handleDownload}>
        <Icon
          style={{
            marginTop: 0,
            paddingTop: 0,
            color: variables.brandLight,
            marginRight: 0,
            fontSize: 36,
            lineHeight: 40,
          }}
          name={isDownloaded ? 'cloud-download' : 'cloud-download-outline'}
        />
      </Button>
    </>
  );
};

export default Download;
