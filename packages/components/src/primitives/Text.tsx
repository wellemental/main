import React from 'react';
import { Text as NBText, NativeBase } from 'native-base';
import { StyleSheet } from 'react-native';

export type Props = NativeBase.Text;

const Text: React.FC<Props> = ({ style, ...props }) => (
  <NBText style={StyleSheet.flatten([style, { flexShrink: 1 }])} {...props} />
);

export default Text;
