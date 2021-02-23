import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  pt?: number;
  pb?: number;
  py?: number;
  px?: number;
  mt?: number;
  mb?: number;
  my?: number;
  mx?: number;
  p?: number;
  m?: number;
  row?: boolean;
  center?: boolean;
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  style?: ViewStyle;
};

const Box: React.FC<Props> = ({
  m,
  p,
  pt,
  pb,
  py,
  px,
  mt,
  mb,
  mx,
  my,
  center,
  justifyContent,
  alignItems,
  row,
  children,
  style,
}) => {
  const spacing = 8;

  const styles = StyleSheet.create({
    view: {
      paddingTop: p ? spacing * p : py ? spacing * py : pt ? spacing * pt : 0,
      paddingBottom: p
        ? spacing * p
        : py
        ? spacing * py
        : pb
        ? spacing * pb
        : 0,
      paddingHorizontal: p ? spacing * p : px ? spacing * px : 0,
      marginHorizontal: m ? spacing * m : mx ? spacing * mx : 0,
      marginTop: m ? spacing * m : mt ? mt * spacing : my ? spacing * my : 0,
      marginBottom: m ? spacing * m : mb ? mb * spacing : my ? spacing * my : 0,
      alignItems: center ? 'center' : alignItems ? alignItems : 'flex-start',
      flexDirection: row ? 'row' : 'column',
      justifyContent: center
        ? 'center'
        : justifyContent
        ? justifyContent
        : 'flex-start',
    },
  });

  const flattenStyle = StyleSheet.flatten([styles.view, style]);

  return <View style={flattenStyle}>{children}</View>;
};

export default Box;
