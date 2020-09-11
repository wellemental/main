import React from 'react';
import { View, StyleSheet, StyleProp } from 'react-native';

type Props = {
  gt?: number;
  gb?: number;
  gv?: number;
  row?: boolean;
  center?: boolean;
  justifyContent?: string;
};

const Box: React.FC<Props> = ({
  gt,
  gb,
  gv,
  center,
  justifyContent,
  row,
  children,
}) => {
  const spacing = 15;

  const styles = StyleSheet.create({
    view: {
      paddingTop: gv ? spacing * gv : gt ? spacing * gt : 0,
      paddingBottom: gv ? spacing * gv : gb ? spacing * gb : 0,
      alignItems: center ? 'center' : 'flex-start',
      flexDirection: row ? 'row' : 'column',
      justifyContent: center
        ? 'center'
        : justifyContent
        ? justifyContent
        : 'flex-start',
    },
  });

  return <View style={styles.view}>{children}</View>;
};

export default Box;
