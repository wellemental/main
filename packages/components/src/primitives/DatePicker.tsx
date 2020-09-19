import React, { useState } from 'react';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
// import { DatePicker as NBDatePicker, Item, Label } from 'native-base';
import moment from 'moment';
import { Platform } from 'react-native';
import { Text, View, Item, Label } from 'native-base';
import Modal from 'react-native-modal';
import { Translations } from '../types';
import Button from './Button';
import variables from '../assets/native-base-theme/variables/wellemental';

type Props = {
  date?: Date;
  translation: Translations;
  onDateChange: React.Dispatch<(prevState: undefined) => undefined>;
  // locale?: 'es' | 'en';
};

// interface Props {
//   mode: 'date' | 'time';
//   initialValue: Date;
//   disabled: boolean;
//   value?: Date;
//   placeholderText?: string;
//   maximumDate?: Date;
//   minimumDate?: Date;
//   // onChange?(value: Date): void;
//   onDateChange: React.Dispatch<(prevState: undefined) => undefined>;
//   willDismiss?(): void;
//   full?: boolean;
// }

const DatePicker: React.FC<Props> = ({
  date,
  translation,
  onDateChange,
  // locale,
}) => {
  // const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  // const handleDateChange = (newDate) => {
  //   onDateChange(newDate);
  // };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    onDateChange(currentDate);
  };

  return (
    <>
      <Label style={{ fontSize: 15, color: variables.textColor }}>
        {translation.Birthday}
      </Label>
      <Button
        transparent
        onPress={() => setShow(true)}
        text={moment(date).format('MM/DD/YYYY')}
      />

      {show && date && (
        <DateTimePicker
          // mode="date"
          value={new Date()}
          display="default"
          onChange={() => handleDateChange}
          // maximumDate={this.props.maximumDate}
          // minimumDate={this.props.minimumDate}
        />
      )}

      <Item style={{ marginLeft: 0, marginBottom: 25, alignSelf: 'stretch' }} />
    </>
  );
};

export default DatePicker;
