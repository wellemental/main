import React from 'react';
import Box from '../utils/Box';
import Paragraph from '../typography/Paragraph';
import Headline from '../typography/Headline';
import Icon from '../icons/Icon';
import { useCurrentUser } from '../../hooks';
import { colors } from 'common';

type Props = {
  type: 'streak' | 'completed' | 'time';
  last?: boolean;
};

const StatDisplay: React.FC<Props> = ({ type, last }) => {
  const { user } = useCurrentUser();
  const totalSeconds = 120; //user.totalSeconds;
  const totalHours = totalSeconds > 0 ? Math.floor(totalSeconds / 3600) : 0;

  const minuteRemainder =
    totalHours > 0
      ? Math.floor((totalSeconds / 60) % totalHours)
      : Math.floor(totalSeconds / 60);

  const hourLabel = totalHours > 1 ? 'hrs' : 'hr';
  const minuteLabel = minuteRemainder > 1 ? 'mins' : 'min';

  const typeObj =
    type === 'streak'
      ? {
          label: 'Streak',
          icon: 'trophy-outline',
          bgColor: colors.primary,
        }
      : type === 'completed'
      ? {
          label: 'Sessions Completed',
          icon: 'videocam-outline',
          bgColor: colors.warning,
        }
      : {
          label: 'Total Time',
          icon: 'timer-outline',
          bgColor: colors.secondary,
        };

  const streakDisplay = (
    <Box row justifyContent="center">
      <Headline
        style={{
          color: typeObj.bgColor,
          fontSize: '48px',
          lineHeight: '59px',
          marginRight: '3px',
        }}>
        {user.streak}
      </Headline>
      <Headline
        style={{
          color: typeObj.bgColor,
          fontSize: '28px',
          lineHeight: '66px',
        }}>
        days
      </Headline>
    </Box>
  );

  const totalTimeDisplay =
    totalHours > 0 ? (
      <Box row justifyContent="flex-end" alignItems="flex-end">
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: 48,
            lineHeight: 58,
            marginRight: 3,
          }}>
          {totalHours}
        </Headline>
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: '28px',
            marginRight: '15px',
            lineHeight: '66px',
          }}>
          {hourLabel}
        </Headline>
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: '48px',
            lineHeight: '58px',
            marginRight: '3px',
          }}>
          {minuteRemainder}
        </Headline>
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: '28px',
            lineHeight: '66px',
          }}>
          {minuteLabel}
        </Headline>
      </Box>
    ) : (
      <Box row justifyContent="center">
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: '48px',
            lineHeight: '59px',
            marginRight: '3px',
          }}>
          {minuteRemainder}
        </Headline>
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: '28px',
            lineHeight: '66px',
          }}>
          {minuteLabel}
        </Headline>
      </Box>
    );

  return (
    <Box
      mt={1}
      p={2}
      style={{
        borderBottom: `${last ? 0 : '3px'} solid ${typeObj.bgColor}`,
        textAlign: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}>
      <Box row justifyContent="center" mb={1}>
        <Icon
          style={{
            color: typeObj.bgColor,
            fontSize: '24px',
            lineHeight: '25px',
            paddingRight: '3px',
          }}
          name={typeObj.icon}
        />
        <Paragraph
          style={{
            color: typeObj.bgColor,
            lineHeight: '25px',
            fontSize: '16px',
            textAlign: 'center',
          }}>
          {typeObj.label}
        </Paragraph>
      </Box>
      {type === 'completed' ? (
        <Headline
          center
          style={{
            color: typeObj.bgColor,
            fontSize: '48px',
            lineHeight: '56px',
          }}>
          {user.totalCompleted}
        </Headline>
      ) : type === 'streak' ? (
        streakDisplay
      ) : (
        totalTimeDisplay
      )}
    </Box>
  );
};

export default StatDisplay;
