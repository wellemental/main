import React, { useState } from 'react';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
// import { DatePicker as NBDatePicker, Item, Label } from 'native-base';
import moment from 'moment';
import { Platform } from 'react-native';
import { Text, View, Item, Label } from 'native-base';
import Modal from 'react-native-modal';
import { Translations } from '../types';
import Button from './Button';
import Paragraph from './Paragraph';
import variables from '../assets/native-base-theme/variables/wellemental';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  date?: Date;
  translation: Translations;
  onDateChange: React.Dispatch<(prevState: undefined) => undefined>;
  locale?: 'es' | 'en';
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
  locale,
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
      <TouchableOpacity
        onPress={() => setShow(!show)}
        style={{ paddingVertical: 15 }}>
        <Paragraph style={{ fontSize: 18 }}>
          {moment(date).format('MM/DD/YYYY')}
        </Paragraph>
      </TouchableOpacity>
      {/* <Button
        transparent
        onPress={() => setShow(!show)}
        text={moment(date).format('MM/DD/YYYY')}
        style={{ paddingLeft: 0, alignItems: 'flex-start', marginRight: 0 }}
      /> */}

      {show && date && (
        <DateTimePicker
          style={{ backgroundColor: '#ccc', color: '#fff' }}
          mode="date"
          value={date}
          display="default"
          onChange={() => handleDateChange}
          locale={locale}
          maximumDate={moment().toDate()}
          // maximumDate={this.props.maximumDate}
          // minimumDate={this.props.minimumDate}
        />
      )}

      <Item style={{ marginLeft: 0, marginBottom: 25, alignSelf: 'stretch' }} />
    </>
  );
};

export default DatePicker;
