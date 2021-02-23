import React from 'react';
import { Text } from 'react-native';
import Box from './Box';
import Headline from './Headline';
import { Icon } from 'native-base';
import { useCurrentUser } from '../hooks';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';

type Props = {
  type: 'streak' | 'completed' | 'time';
};

const StatDisplay: React.FC<Props> = ({ type }) => {
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
          bgColor: brandColors.brandPrimary,
        }
      : type === 'completed'
      ? {
          label: translation['Sessions Completed'],
          icon: 'videocam-outline',
          bgColor: brandColors.brandWarning,
        }
      : {
          label: translation['Total Time'],
          icon: 'timer-outline',
          bgColor: brandColors.brandSecondary,
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

  // const totalTimeDisplay =
  //   totalHours > 0
  //     ? `${totalHours}${hourLabel} ${minuteRemainder}${minuteLabel}`
  //     : `${minuteRemainder}mins`;

  return (
    <Box
      mt={1}
      p={2}
      style={{
        // backgroundColor: typeObj.bgColor,
        borderBottomWidth: 3,
        borderBottomColor: typeObj.bgColor,
        display: 'flex',
        alignItems: 'center',
      }}>
      <Box row mb={1}>
        <Icon
          style={{
            // color: 'white',
            color: typeObj.bgColor,
            fontSize: 24,
            lineHeight: 25,
            paddingRight: 3,
          }}
          name={typeObj.icon}
        />
        <Text
          style={{
            // color: 'white',
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
            // color: 'white',
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