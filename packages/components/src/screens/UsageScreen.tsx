import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  PageHeading,
  Paragraph,
  Container,
  Headline,
  Box,
} from 'components/src/primitives';
import {
  NotificationScreenNavigationProp,
} from 'components/src/types';
import {
  BarChart,
} from "react-native-chart-kit";
import { colors } from 'common';
import { useCurrentUser } from '../hooks';
import moment from 'moment';

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  barPercentage: 0.8,
  height: 5000,
  fillShadowGradient: colors.primary,
  fillShadowGradientOpacity: 1,
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(1, 122, 205, 1)`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#e3e3e3",
    strokeDasharray: "0",
  },
  propsForLabels: {
    fontSize: 10,
  },
};

type Props = {
  navigation: NotificationScreenNavigationProp;
};

const UsageScreen: React.FC<Props> = ({ navigation }) => {
  const [chartData, setChartData] = useState(null);
  const width = useWindowDimensions().width * 0.9;
  const height = useWindowDimensions().height * 0.5;
  const { user } = useCurrentUser();

  useEffect(() => {
    const { appUsageTime } = user;
    let labels = [];
    let data = [];
    Object.keys(appUsageTime).sort().map(k => {
      const label = moment(k, 'MMDDYYYY').format('MM/DD');
      const totalTime = appUsageTime[k].reduce((total, t) => {
        const diff = moment(t.end).diff(moment(t.start), 'seconds');
        return total + diff;
      }, 0);
      const avg = (totalTime / appUsageTime[k].length) || 0;
      const hourlyAvg = avg / 60;
      labels.push(label);
      data.push(hourlyAvg);
    });

    setChartData({
      labels,
      datasets: [{data}]
    })
  }, []);

  return (
    <Container>
      <PageHeading title="Usage" />
      <Box>
        {
          chartData && (
            <BarChart
              style={{ marginLeft: -15 }}
              data={chartData}
              width={width+20}
              height={height}
              showBarTops={false}
              yAxisInterval={100}
              yAxisSuffix=" min"
              withInnerLines={false}
              chartConfig={chartConfig}
              fromZero={true} /> ||
            <Paragraph bold>
              Keep using the app to grow your chart
            </Paragraph>
          )
        }
        <Box row justifyContent="space-between" mt={2} mb={0.5}>
          <Headline style={{ flex: 4 }}>App usage Time</Headline>
        </Box>

        <Box row pb={1.5}>
          <Paragraph bold>Your quality time spent around the app</Paragraph>
        </Box>
      </Box>
    </Container>
  );
};

export default UsageScreen;
