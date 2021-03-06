import React, { useState, useEffect } from 'react';
import { Button, Icon, Toast } from 'native-base';
import { DownloadVideoService, DownloadProgressCallbackResult } from 'services';
import { colors } from 'common';

interface Props {
  videoUrl: string;
}

const Download: React.FC<Props> = ({ videoUrl }) => {
  const [isDownloaded, toggleDownload] = useState(false);
  const [loading, setLoading] = useState(false);
  const service = new DownloadVideoService();

  useEffect(() => {
    const checkIfDownloaded = async (): Promise<void> => {
      try {
        toggleDownload(await service.checkExists(videoUrl));
      } catch (err) {
        console.log('Error checking video cache status');
      }
    };
    checkIfDownloaded();
  }, [videoUrl]);

  const handleDownload = async () => {
    setLoading(true);
    if (isDownloaded) {
      try {
        await service.deleteVideo(videoUrl);
        toggleDownload(false);
        Toast.show({
          text: 'Video removed',
          style: { marginBottom: 20 },
        });
      } catch (err) {
        Toast.show({
          text: 'Error removing video. Try again.',
          style: { marginBottom: 20 },
        });
      }
    } else {
      try {
        await service.downloadVideo(videoUrl);
        toggleDownload(true);
        Toast.show({
          text: 'Video saved for offline',
          style: { marginBottom: 20 },
        });
      } catch (err) {
        Toast.show({
          text: 'Error saving video for offline. Please try again.',
          style: { marginBottom: 20 },
        });
      }
    }

    setLoading(false);
  };
  return (
    <>
      <Button
        iconRight
        disabled={loading}
        style={{
          paddingBottom: 0,
        }}
        transparent
        onPress={handleDownload}>
        <Icon
          style={{
            marginTop: 0,
            paddingTop: 0,
            color: colors.light,
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
