import React from 'react';
import Download from './Download';
import Box from './Box';
import Paragraph from './Paragraph';
import { colors } from 'common';
import { DownloadVideoService } from 'services';

type Props = {
  videoUrl: string;
};

const DownloadRow: React.FC<Props> = ({ videoUrl }) => {
  // const service = new DownloadVideoService();

  return (
    <Box
      row
      my={2}
      py={0.5}
      px={1}
      justifyContent="space-between"
      alignItems="center"
      style={{
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.offWhite,
      }}>
      <Box>
        <Paragraph bold>Save for offline</Paragraph>
      </Box>
      <Download videoUrl={videoUrl} />
    </Box>
  );
};

export default DownloadRow;
