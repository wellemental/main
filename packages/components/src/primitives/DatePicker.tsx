import React, { useState } from 'react';
import { Text, View } from 'native-base';
import { Button } from './Button';
import moment from 'moment';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import variables from '../assets/native-base-theme/variables/platform';
import Modal from 'react-native-modal';

interface Props {
  mode: 'date' | 'time';
  date: Date;
  disabled: boolean;
  placeholderText?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  onChange?(value: Date): void;
  willDismiss?(): void;
  hourInterval: number[];
  full?: boolean;
}

const DatePicker: React.FC<Props & DateTimePicker> = ({
  mode,
  date,
  disabled,
  placeholderText,
  maximumDate,
  minimumDate,
  full,
  onChange,
  willDismiss,
}) => {
  const [show, toggleShow] = useState(false);

  return (
    <View style={full && { flex: 1 }}>
      <DateTimePicker
        mode={mode ? mode : 'date'}
        value={date}
        // onChange={() => onChange}
        maximumDate={maximumDate ? maximumDate : moment().toDate()}
        minimumDate={minimumDate ? minimumDate : undefined}
      />
    </View>
  );
};

export default DatePicker;
