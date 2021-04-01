import React from 'react';
import { Text } from 'react-native';
import Box from '../utils/Box';
import Headline from '../typography/Headline';
import { Icon } from 'native-base';
import { useCurrentUser } from '../../hooks';
import { colors } from 'common';

type Props = {
  type: 'streak' | 'completed' | 'time';
  last?: boolean;
};

const StatDisplay: React.FC<Props> = ({ type, last }) => {
  const { translation, user } = useCurrentUser();
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
          label: translation.Streak,
          icon: 'trophy-outline',
          bgColor: colors.primary,
        }
      : type === 'completed'
      ? {
          label: translation['Sessions Completed'],
          icon: 'videocam-outline',
          bgColor: colors.warning,
        }
      : {
          label: translation['Total Time'],
          icon: 'timer-outline',
          bgColor: colors.secondary,
        };

  const streakDisplay = (
    <Box row>
      <Headline
        style={{
          color: typeObj.bgColor,
          fontSize: 48,
          lineHeight: 59,
          marginRight: 3,
        }}>
        {user.streak}
      </Headline>
      <Headline
        style={{
          color: typeObj.bgColor,
          fontSize: 28,
          lineHeight: 66,
        }}>
        {translation.days}
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
            fontSize: 28,
            marginRight: 15,
            lineHeight: 66,
          }}>
          {hourLabel}
        </Headline>
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: 48,
            lineHeight: 58,
            marginRight: 3,
          }}>
          {minuteRemainder}
        </Headline>
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: 28,
            lineHeight: 66,
          }}>
          {minuteLabel}
        </Headline>
      </Box>
    ) : (
      <Box row>
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: 48,
            lineHeight: 59,
            marginRight: 3,
          }}>
          {minuteRemainder}
        </Headline>
        <Headline
          style={{
            color: typeObj.bgColor,
            fontSize: 28,
            lineHeight: 66,
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
        borderBottomWidth: last ? 0 : 3,
        borderBottomColor: typeObj.bgColor,
        display: 'flex',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
      <Box row mb={1}>
        <Icon
          style={{
            color: typeObj.bgColor,
            fontSize: 24,
            lineHeight: 25,
            paddingRight: 3,
          }}
          name={typeObj.icon}
        />
        <Text
          style={{
            color: typeObj.bgColor,
            lineHeight: 25,
            fontSize: 16,
          }}>
          {typeObj.label}
        </Text>
      </Box>
      {type === 'completed' ? (
        <Headline
          center
          style={{
            color: typeObj.bgColor,
            fontSize: 48,
            lineHeight: 56,
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
