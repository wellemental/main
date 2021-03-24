import React from 'react';
import Download from '../icons/Download';
import Box from '../utils/Box';
import Paragraph from '../typography/Paragraph';
import Icon from '../icons/Icon';
import { colors } from 'common';
import { useCurrentUser } from '../../hooks';

type Props = {
  videoUrl: string;
};

const DownloadRow: React.FC<Props> = ({ videoUrl }) => {
  const { activePlan, translation } = useCurrentUser();

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
        <Paragraph bold>{translation['Save for offline']}</Paragraph>
      </Box>
      {activePlan ? (
        <Download videoUrl={videoUrl} />
      ) : (
        <Icon
          name="lock-closed"
          style={{ fontSize: 33, paddingVertical: 10 }}
        />
      )}
    </Box>
  );
};

export default DownloadRow;
