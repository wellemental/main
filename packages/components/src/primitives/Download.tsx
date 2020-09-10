import React, { useState, useEffect } from 'react';
import { Button, Icon, Text } from 'native-base';
import { Paragraph } from './Paragraph';
import { useCurrentUser } from '../hooks/useCurrentUser';
import {
  DownloadVideoService,
  DownloadProgressCallbackResult,
  Content,
} from 'services';
// import { useMutation } from '../hooks/useMutation';
import variables from '../assets/native-base-theme/variables/wellemental';

interface Props {
  //   contentId: string;
  content: Content;
  onProfile?: boolean;
}

const Download: React.FC<Props> = ({ content, onProfile }) => {
  const [isDownloaded, toggleDownload] = useState(false);

  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const service = new DownloadVideoService();
  //   const { loading, mutate } = useMutation(() =>
  //     service.favorite(user.id, content.id, !isDownloaded),
  //   );

  useEffect(() => {
    const checkIfDownloaded = async (): Promise<void> => {
      try {
        toggleDownload(await service.checkExists(content.video));
      } catch (err) {
        setError(err);
      }
    };
    checkIfDownloaded();
  }, [content.video]);

  const calcProgress = (data: DownloadProgressCallbackResult): void => {
    console.log('CALC PROGRESS');
    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
    if (data) {
      setProgress(percentage);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      if (isDownloaded) {
        await service.deleteVideo(content.video);
        toggleDownload(false);
      } else {
        await service.downloadVideo(content.video, calcProgress);
        toggleDownload(true);
      }
    } catch (err) {
      setError('Error');
    }
    setLoading(false);
  };
  return (
    <>
      {/* <Button onPress={() => getUrl(content.video)}>
        <Text>Get</Text>
      </Button> */}

      <Button
        iconRight
        disabled={loading}
        style={{
          paddingRight: 0,
          paddingBottom: 0,
          marginTop: onProfile ? -14 : 0,
        }}
        transparent
        onPress={handleDownload}>
        <Icon
          style={{
            marginTop: 0,
            paddingTop: 0,
            color: variables.brandLight,
            marginRight: 0,
            fontSize: onProfile ? 36 : 30,
            lineHeight: 40,
            opacity: loading ? 0.5 : 1,
          }}
          name={isDownloaded ? 'cloud-download' : 'cloud-download-outline'}
        />
        {progress !== 0 && <Text>{progress}</Text>}
      </Button>
    </>
  );
};

export default Download;
